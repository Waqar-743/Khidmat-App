import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../services/app_state.dart';
import '../agents/bharosa_agent.dart';
import '../theme/app_colors.dart';
import '../widgets/provider_card.dart';

class ProviderListScreen extends StatelessWidget {
  const ProviderListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Consumer<AppState>(
        builder: (ctx, state, _) {
          final providers = state.rankedProviders;
          final intent = state.currentIntent;

          return CustomScrollView(
            slivers: [
              _buildHeader(context, intent?.serviceType ?? 'Providers', intent?.location ?? ''),
              if (providers == null)
                SliverFillRemaining(child: _buildLoading())
              else ...[
                _buildStats(providers),
                _buildAgentSummary(state),
                _buildProviderList(context, state, providers),
              ],
            ],
          );
        },
      ),
    );
  }

  SliverAppBar _buildHeader(BuildContext ctx, String service, String location) {
    return SliverAppBar(
      backgroundColor: AppColors.surface,
      pinned: true,
      expandedHeight: 120,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: AppColors.textPrimary),
        onPressed: () => ctx.pop(),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.timeline, color: AppColors.primary),
          onPressed: () => ctx.push('/logs'),
        ),
      ],
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [AppColors.surface, AppColors.background],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
          padding: const EdgeInsets.fromLTRB(20, 60, 20, 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Text(
                service,
                style: GoogleFonts.inter(
                  color: AppColors.textPrimary,
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                ),
              ),
              if (location.isNotEmpty)
                Row(
                  children: [
                    const Icon(Icons.location_on, color: AppColors.textMuted, size: 13),
                    const SizedBox(width: 4),
                    Text(location, style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 12)),
                  ],
                ),
            ],
          ),
        ),
      ),
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1),
        child: Container(height: 1, color: AppColors.divider),
      ),
    );
  }

  Widget _buildStats(List<BharosaReport> providers) {
    final topTrust = providers.isEmpty ? 0 : providers.first.trustScore;
    final avgTrust = providers.isEmpty
        ? 0
        : (providers.map((p) => p.trustScore).reduce((a, b) => a + b) / providers.length).round();
    final available = providers.where((p) => p.provider.availableSlots.isNotEmpty).length;

    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
        child: Row(
          children: [
            _statChip('${providers.length}', 'Providers', AppColors.primary),
            const SizedBox(width: 8),
            _statChip('$available', 'Available', AppColors.agentBharosa),
            const SizedBox(width: 8),
            _statChip('$topTrust/100', 'Top Trust', AppColors.agentMolBhaav),
            const SizedBox(width: 8),
            _statChip('$avgTrust avg', 'Avg Score', AppColors.agentDhoond),
          ],
        )
            .animate()
            .fadeIn(duration: 400.ms)
            .slideY(begin: -0.1, end: 0),
      ),
    );
  }

  Widget _statChip(String value, String label, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color.withValues(alpha: 0.25)),
        ),
        child: Column(
          children: [
            Text(value, style: GoogleFonts.inter(color: color, fontSize: 13, fontWeight: FontWeight.w800)),
            Text(label, style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 10)),
          ],
        ),
      ),
    );
  }

  Widget _buildAgentSummary(AppState state) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.surfaceElevated,
            borderRadius: BorderRadius.circular(12),
            border: const Border.fromBorderSide(BorderSide(color: AppColors.divider)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Agent Pipeline Complete',
                style: GoogleFonts.inter(color: AppColors.textSecondary, fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 0.5),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  _pipelineStep('FAHAM', AppColors.agentFaham, true),
                  _pipelineArrow(),
                  _pipelineStep('DHOOND', AppColors.agentDhoond, true),
                  _pipelineArrow(),
                  _pipelineStep('BHAROSA', AppColors.agentBharosa, true),
                  _pipelineArrow(),
                  _pipelineStep('MOL-BHAAV', AppColors.agentMolBhaav, false),
                  _pipelineArrow(),
                  _pipelineStep('BOOK', AppColors.agentBook, false),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _pipelineStep(String name, Color color, bool done) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
      decoration: BoxDecoration(
        color: done ? color.withValues(alpha: 0.15) : AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: done ? color.withValues(alpha: 0.4) : AppColors.divider),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (done) Icon(Icons.check, color: color, size: 9),
          if (done) const SizedBox(width: 3),
          Text(
            name,
            style: GoogleFonts.inter(
              color: done ? color : AppColors.textMuted,
              fontSize: 8,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }

  Widget _pipelineArrow() {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 3),
      child: Icon(Icons.arrow_forward, color: AppColors.divider, size: 10),
    );
  }

  Widget _buildLoading() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const CircularProgressIndicator(color: AppColors.primary, strokeWidth: 2),
          const SizedBox(height: 16),
          Text('BHAROSA analyzing trust scores...', style: GoogleFonts.inter(color: AppColors.textSecondary, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _buildProviderList(BuildContext ctx, AppState state, List<BharosaReport> providers) {
    return SliverPadding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
      sliver: SliverList(
        delegate: SliverChildBuilderDelegate(
          (context, i) {
            if (i == 0) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  children: [
                    Text(
                      '${providers.length} providers · sorted by BHAROSA trust',
                      style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 12),
                    ),
                    const Spacer(),
                    const Icon(Icons.verified_user, color: AppColors.agentBharosa, size: 14),
                  ],
                ),
              );
            }
            final p = providers[i - 1];
            return ProviderCard(
              report: p,
              isTop: i == 1,
              index: i,
              onBook: () async {
                await state.startNegotiation(p);
                if (ctx.mounted) ctx.push('/negotiation');
              },
            );
          },
          childCount: providers.length + 1,
        ),
      ),
    );
  }
}
