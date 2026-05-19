import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../services/app_state.dart';
import '../models/chat_message.dart';
import '../theme/app_colors.dart';
import '../widgets/chat_bubble.dart';
import '../widgets/intent_card.dart';
import '../widgets/pulsing_dot.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  final _focusNode = FocusNode();

  final _suggestions = [
    'Mujhe G-13 mein AC technician chahiye kal subah',
    'Bijli ki problem hai, urgent electrician chahiye',
    'Plumber chahiye, nalkay leak ho rahe hain',
    'Deep cleaning karwani hai poore ghar ki',
    'Math tutor chahiye for my child',
    'Beautician chahiye ghar par',
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AppState>().addWelcomeMessages();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _send() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    _controller.clear();
    _focusNode.unfocus();
    await context.read<AppState>().sendMessage(text);
    _scrollToBottom();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: _buildAppBar(),
      body: Column(
        children: [
          _buildPipelineStatus(),
          Expanded(child: _buildMessageList()),
          _buildInputArea(),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: AppColors.surface,
      elevation: 0,
      title: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              gradient: AppColors.primaryGradient,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(
              child: Text('خ', style: GoogleFonts.notoNaskhArabic(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w700)),
            ),
          ),
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('KHIDMAT', style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w800, letterSpacing: 1)),
              Text('AI Service Orchestrator', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 10)),
            ],
          ),
        ],
      ),
      actions: [
        Consumer<AppState>(
          builder: (ctx, state, _) => state.agentLogs.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.timeline, color: AppColors.primary),
                  tooltip: 'Agent Logs',
                  onPressed: () => context.push('/logs'),
                )
              : const SizedBox.shrink(),
        ),
        IconButton(
          icon: const Icon(Icons.help_outline, color: AppColors.textSecondary),
          onPressed: () => context.push('/help'),
        ),
        PopupMenuButton<String>(
          icon: const Icon(Icons.more_vert, color: AppColors.textSecondary),
          color: AppColors.surfaceCard,
          onSelected: (v) {
            if (v == 'reset') context.read<AppState>().reset();
            if (v == 'api') _showApiKeyDialog();
          },
          itemBuilder: (_) => [
            PopupMenuItem(value: 'api', child: Text('Set API Key', style: GoogleFonts.inter(color: AppColors.textPrimary))),
            PopupMenuItem(value: 'reset', child: Text('New Chat', style: GoogleFonts.inter(color: AppColors.textPrimary))),
          ],
        ),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1),
        child: Container(height: 1, color: AppColors.divider),
      ),
    );
  }

  Widget _buildPipelineStatus() {
    return Consumer<AppState>(
      builder: (ctx, state, _) {
        if (state.stage == PipelineStage.idle || state.stage == PipelineStage.complete) {
          return const SizedBox.shrink();
        }
        final agentNames = {
          PipelineStage.parsing: ('FAHAM', AppColors.agentFaham),
          PipelineStage.searching: ('DHOOND', AppColors.agentDhoond),
          PipelineStage.scoring: ('BHAROSA', AppColors.agentBharosa),
          PipelineStage.negotiating: ('MOL-BHAAV', AppColors.agentMolBhaav),
          PipelineStage.booking: ('BOOK', AppColors.agentBook),
        };
        final agentInfo = agentNames[state.stage];
        if (agentInfo == null) return const SizedBox.shrink();
        final (name, color) = agentInfo;

        return Container(
          color: color.withValues(alpha: 0.1),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: [
              PulsingDot(color: color, size: 8),
              const SizedBox(width: 10),
              Text(
                '$name Agent running...',
                style: GoogleFonts.inter(color: color, fontSize: 12, fontWeight: FontWeight.w600),
              ),
            ],
          ),
        ).animate().fadeIn(duration: 200.ms);
      },
    );
  }

  Widget _buildMessageList() {
    return Consumer<AppState>(
      builder: (ctx, state, _) {
        WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());

        if (state.messages.isEmpty) return const SizedBox.shrink();

        return ListView.builder(
          controller: _scrollController,
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          itemCount: state.messages.length + (state.rankedProviders != null ? 1 : 0),
          itemBuilder: (ctx, i) {
            // After messages, show providers button if available
            if (i == state.messages.length && state.rankedProviders != null) {
              return _buildViewProvidersButton(state);
            }

            final msg = state.messages[i];
            switch (msg.type) {
              case MessageType.intentCard:
                return IntentCard(
                  intent: msg.intent!,
                  onViewProviders: state.rankedProviders != null
                      ? () => context.push('/providers')
                      : null,
                );
              case MessageType.receipt:
                return _buildReceiptPreview(msg);
              default:
                return ChatBubble(message: msg);
            }
          },
        );
      },
    );
  }

  Widget _buildViewProvidersButton(AppState state) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12, left: 40),
      child: GestureDetector(
        onTap: () => context.push('/providers'),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [AppColors.primary.withValues(alpha: 0.15), AppColors.primary.withValues(alpha: 0.05)],
            ),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.primary.withValues(alpha: 0.4)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.people_alt_outlined, color: AppColors.primary, size: 18),
              const SizedBox(width: 8),
              Text(
                'View ${state.rankedProviders!.length} Matched Providers →',
                style: GoogleFonts.inter(color: AppColors.primary, fontSize: 13, fontWeight: FontWeight.w600),
              ),
            ],
          ),
        )
            .animate()
            .fadeIn(duration: 400.ms)
            .shimmer(duration: 1500.ms, color: AppColors.primary.withValues(alpha: 0.2)),
      ),
    );
  }

  Widget _buildReceiptPreview(ChatMessage msg) {
    final r = msg.receipt!;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        margin: const EdgeInsets.only(left: 40),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [AppColors.agentBook.withValues(alpha: 0.12), AppColors.agentBook.withValues(alpha: 0.04)],
          ),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.agentBook.withValues(alpha: 0.3)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.event_available, color: AppColors.agentBook, size: 16),
                const SizedBox(width: 6),
                Text('Booking Confirmed!', style: GoogleFonts.inter(color: AppColors.agentBook, fontSize: 13, fontWeight: FontWeight.w700)),
                const Spacer(),
                Text('#${r.bookingId}', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11)),
              ],
            ),
            const SizedBox(height: 8),
            Text('${r.service} · ${r.provider.name}', style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.w600)),
            Text('${r.date} at ${r.time} · ${r.location}', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 12)),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () => context.push('/booking'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.agentBook,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              child: Text('View Full Receipt', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputArea() {
    return Consumer<AppState>(
      builder: (ctx, state, _) {
        final hasMessages = state.messages.isNotEmpty;

        return Container(
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: const Border(top: BorderSide(color: AppColors.divider)),
          ),
          child: Column(
            children: [
              // Suggestion chips (only when no messages or first time)
              if (!hasMessages || state.messages.length <= 1)
                _buildSuggestions(),

              // Input row
              Padding(
                padding: EdgeInsets.fromLTRB(
                  12, 8, 12, MediaQuery.of(context).padding.bottom + 8,
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _controller,
                        focusNode: _focusNode,
                        enabled: !state.isProcessing,
                        maxLines: null,
                        style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 14),
                        decoration: InputDecoration(
                          hintText: 'Koi bhi service maangein... (Urdu ya English)',
                          hintStyle: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 14),
                          filled: true,
                          fillColor: AppColors.surfaceElevated,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: const BorderSide(color: AppColors.divider),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: const BorderSide(color: AppColors.divider),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        ),
                        onSubmitted: (_) => _send(),
                      ),
                    ),
                    const SizedBox(width: 8),
                    GestureDetector(
                      onTap: state.isProcessing ? null : _send,
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          gradient: state.isProcessing ? null : AppColors.primaryGradient,
                          color: state.isProcessing ? AppColors.surfaceHighest : null,
                          shape: BoxShape.circle,
                          boxShadow: state.isProcessing
                              ? null
                              : [BoxShadow(color: AppColors.primary.withValues(alpha: 0.3), blurRadius: 8)],
                        ),
                        child: Icon(
                          state.isProcessing ? Icons.hourglass_empty : Icons.send_rounded,
                          color: state.isProcessing ? AppColors.textMuted : Colors.white,
                          size: 20,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSuggestions() {
    return SizedBox(
      height: 44,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        itemCount: _suggestions.length,
        itemBuilder: (ctx, i) => Padding(
          padding: const EdgeInsets.only(right: 8),
          child: GestureDetector(
            onTap: () {
              _controller.text = _suggestions[i];
              _send();
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(20),
                border: const Border.fromBorderSide(BorderSide(color: AppColors.divider)),
              ),
              child: Text(
                _suggestions[i],
                style: GoogleFonts.inter(color: AppColors.textSecondary, fontSize: 12),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _showApiKeyDialog() {
    final ctrl = TextEditingController(text: context.read<AppState>().geminiApiKey ?? '');
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surfaceCard,
        title: Text('Gemini API Key', style: GoogleFonts.inter(color: AppColors.textPrimary, fontWeight: FontWeight.w700)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Enter your Google Gemini API key to enable enhanced NLP responses.',
              style: GoogleFonts.inter(color: AppColors.textSecondary, fontSize: 13),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: ctrl,
              style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 13),
              decoration: InputDecoration(
                hintText: 'AIzaSy...',
                hintStyle: GoogleFonts.inter(color: AppColors.textMuted),
                prefixIcon: const Icon(Icons.key, color: AppColors.primary, size: 18),
              ),
              obscureText: true,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel', style: GoogleFonts.inter(color: AppColors.textMuted)),
          ),
          ElevatedButton(
            onPressed: () {
              if (ctrl.text.isNotEmpty) {
                context.read<AppState>().setGeminiApiKey(ctrl.text.trim());
              }
              Navigator.pop(ctx);
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }
}
