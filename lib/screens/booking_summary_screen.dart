import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../services/app_state.dart';
import '../theme/app_colors.dart';
import '../models/agent_log.dart';

class BookingSummaryScreen extends StatelessWidget {
  const BookingSummaryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (ctx, state, _) {
        final booking = state.currentBooking;
        if (booking == null) {
          return Scaffold(
            backgroundColor: AppColors.background,
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('No booking found', style: GoogleFonts.inter(color: AppColors.textSecondary)),
                  const SizedBox(height: 16),
                  ElevatedButton(onPressed: () => ctx.go('/home'), child: const Text('Go Home')),
                ],
              ),
            ),
          );
        }

        return Scaffold(
          backgroundColor: AppColors.background,
          body: CustomScrollView(
            slivers: [
              _buildHeader(ctx),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      _buildSuccessBanner()
                          .animate()
                          .fadeIn(duration: 500.ms)
                          .scaleXY(begin: 0.9, end: 1, duration: 500.ms, curve: Curves.elasticOut),

                      const SizedBox(height: 20),

                      _buildReceipt(booking),

                      const SizedBox(height: 20),

                      _buildFollowUpSection(),

                      const SizedBox(height: 20),

                      _buildAgentPipelineComplete(),

                      const SizedBox(height: 24),

                      _buildActions(ctx, booking.bookingId),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  SliverAppBar _buildHeader(BuildContext ctx) {
    return SliverAppBar(
      backgroundColor: AppColors.surface,
      floating: true,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back),
        onPressed: () => ctx.go('/home'),
      ),
      title: Text('Booking Confirmed', style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w700)),
      actions: [
        IconButton(
          icon: const Icon(Icons.timeline, color: AppColors.primary),
          onPressed: () => ctx.push('/logs'),
        ),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1),
        child: Container(height: 1, color: AppColors.divider),
      ),
    );
  }

  Widget _buildSuccessBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.primary.withValues(alpha: 0.15), AppColors.agentBook.withValues(alpha: 0.08)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              gradient: AppColors.primaryGradient,
              shape: BoxShape.circle,
              boxShadow: [BoxShadow(color: AppColors.primary.withValues(alpha: 0.4), blurRadius: 16)],
            ),
            child: const Icon(Icons.check, color: Colors.white, size: 32),
          ),
          const SizedBox(height: 14),
          Text(
            'Booking Confirmed!',
            style: GoogleFonts.inter(color: AppColors.primary, fontSize: 20, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 4),
          Text(
            'Your service has been successfully booked.',
            style: GoogleFonts.inter(color: AppColors.textSecondary, fontSize: 13),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildReceipt(booking) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(16),
        border: const Border.fromBorderSide(BorderSide(color: AppColors.divider)),
      ),
      child: Column(
        children: [
          // Receipt header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              color: AppColors.surfaceElevated,
              borderRadius: BorderRadius.only(topLeft: Radius.circular(15), topRight: Radius.circular(15)),
            ),
            child: Row(
              children: [
                const Icon(Icons.receipt_long, color: AppColors.agentBook, size: 16),
                const SizedBox(width: 8),
                Text('Booking Receipt', style: GoogleFonts.inter(color: AppColors.agentBook, fontSize: 13, fontWeight: FontWeight.w700)),
                const Spacer(),
                GestureDetector(
                  onTap: () => Clipboard.setData(ClipboardData(text: booking.bookingId)),
                  child: Text(
                    '#${booking.bookingId}',
                    style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                  ),
                ),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                _receiptRow(Icons.build_circle_outlined, 'Service', booking.service, AppColors.primary),
                _divider(),
                _receiptRow(Icons.person_outline, 'Provider', booking.provider.name, AppColors.agentBharosa),
                _divider(),
                _receiptRow(Icons.location_on_outlined, 'Location', booking.location, AppColors.agentDhoond),
                _divider(),
                _receiptRow(Icons.calendar_today_outlined, 'Date', booking.date, AppColors.agentFaham),
                _divider(),
                _receiptRow(Icons.access_time, 'Time', booking.time, AppColors.agentBook),
                _divider(),
                _receiptRow(Icons.phone_outlined, 'Contact', booking.provider.phone, AppColors.textSecondary),

                const SizedBox(height: 16),

                // Price breakdown
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceElevated,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Original Price', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 13)),
                          Text(
                            'Rs. ${_fmt(booking.originalPrice)}',
                            style: GoogleFonts.inter(
                              color: AppColors.textSecondary,
                              fontSize: 13,
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                        ],
                      ),
                      if (booking.savedAmount > 0) ...[
                        const SizedBox(height: 6),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Savings (MOL-BHAAV)', style: GoogleFonts.inter(color: AppColors.trustHigh, fontSize: 13)),
                            Text('– Rs. ${_fmt(booking.savedAmount)}', style: GoogleFonts.inter(color: AppColors.trustHigh, fontSize: 13, fontWeight: FontWeight.w600)),
                          ],
                        ),
                      ],
                      const SizedBox(height: 8),
                      const Divider(color: AppColors.divider, height: 1),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Final Price', style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.w700)),
                          Text(
                            'Rs. ${_fmt(booking.finalPrice)}',
                            style: GoogleFonts.inter(color: AppColors.primary, fontSize: 15, fontWeight: FontWeight.w800),
                          ),
                        ],
                      ),
                      if (booking.savingsPercent > 0) ...[
                        const SizedBox(height: 4),
                        Align(
                          alignment: Alignment.centerRight,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.trustHigh.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              'You saved ${booking.savingsPercent}%!',
                              style: GoogleFonts.inter(color: AppColors.trustHigh, fontSize: 11, fontWeight: FontWeight.w600),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),

                const SizedBox(height: 12),

                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.warning.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.warning.withValues(alpha: 0.2)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.info_outline, color: AppColors.warning, size: 14),
                      const SizedBox(width: 8),
                      Text('Payment: Cash on service completion', style: GoogleFonts.inter(color: AppColors.warning, fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    )
        .animate()
        .fadeIn(delay: 200.ms, duration: 500.ms)
        .slideY(begin: 0.1, end: 0, delay: 200.ms, duration: 500.ms);
  }

  Widget _buildFollowUpSection() {
    final followUps = [
      ('Reminder set', '1 hour before appointment', AppColors.agentYaadDahani),
      ('Status update', 'When provider is on the way', AppColors.agentBook),
      ('Completion check', 'After service is done', AppColors.agentBharosa),
      ('Rating prompt', '24 hours post-service', AppColors.agentDhoond),
    ];

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.agentYaadDahani.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.agentYaadDahani.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.notifications_active, color: AppColors.agentYaadDahani, size: 16),
              const SizedBox(width: 8),
              Text('YAAD-DAHANI Agent · Follow-Up Plan', style: GoogleFonts.inter(color: AppColors.agentYaadDahani, fontSize: 12, fontWeight: FontWeight.w700)),
            ],
          ),
          const SizedBox(height: 12),
          ...followUps.asMap().entries.map((e) {
            final i = e.key;
            final (title, subtitle, color) = e.value;
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.12),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text('${i + 1}', style: GoogleFonts.inter(color: color, fontSize: 11, fontWeight: FontWeight.w700)),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.w600)),
                      Text(subtitle, style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11)),
                    ],
                  ),
                  const Spacer(),
                  const Icon(Icons.check_circle, color: AppColors.trustHigh, size: 14),
                ],
              ),
            );
          }),
        ],
      ),
    )
        .animate()
        .fadeIn(delay: 400.ms, duration: 400.ms);
  }

  Widget _buildAgentPipelineComplete() {
    final steps = [
      (AgentId.faham, 'Intent parsed'),
      (AgentId.dhoond, 'Providers found'),
      (AgentId.bharosa, 'Trust verified'),
      (AgentId.molBhaav, 'Price negotiated'),
      (AgentId.book, 'Booking confirmed'),
      (AgentId.yaadDahani, 'Follow-up set'),
    ];

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(14),
        border: const Border.fromBorderSide(BorderSide(color: AppColors.divider)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Agent Pipeline — Complete', style: GoogleFonts.inter(color: AppColors.textSecondary, fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 0.5)),
          const SizedBox(height: 12),
          ...steps.asMap().entries.map((e) {
            final i = e.key;
            final (agentId, label) = e.value;
            final info = agentRegistry[agentId]!;
            final color = Color(info.colorValue);
            return Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                  ),
                  const SizedBox(width: 10),
                  Text(info.name, style: GoogleFonts.inter(color: color, fontSize: 12, fontWeight: FontWeight.w700)),
                  const SizedBox(width: 8),
                  Text(label, style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 12)),
                  const Spacer(),
                  const Icon(Icons.check_circle, color: AppColors.trustHigh, size: 14),
                ],
              )
                  .animate()
                  .fadeIn(delay: (i * 100).ms, duration: 300.ms),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildActions(BuildContext ctx, String bookingId) {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: () => ctx.push('/logs'),
            icon: const Icon(Icons.timeline, size: 18),
            label: const Text('View Agent Logs'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
        ),
        const SizedBox(height: 10),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: () => ctx.go('/home'),
            icon: const Icon(Icons.add, size: 18, color: AppColors.textSecondary),
            label: Text('New Booking', style: GoogleFonts.inter(color: AppColors.textSecondary)),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
              side: const BorderSide(color: AppColors.divider),
            ),
          ),
        ),
      ],
    );
  }

  Widget _receiptRow(IconData icon, String label, String value, Color color) {
    return Row(
      children: [
        Icon(icon, color: color, size: 16),
        const SizedBox(width: 10),
        Text(label, style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 13)),
        const Spacer(),
        Flexible(
          child: Text(
            value,
            style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600),
            textAlign: TextAlign.end,
          ),
        ),
      ],
    );
  }

  Widget _divider() => const Padding(
    padding: EdgeInsets.symmetric(vertical: 8),
    child: Divider(color: AppColors.divider, height: 1),
  );

  String _fmt(int n) =>
      n.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]},');
}
