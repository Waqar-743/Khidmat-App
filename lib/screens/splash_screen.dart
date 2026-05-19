import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_colors.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) context.go('/home');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.darkGradient),
        child: Stack(
          children: [
            // Background glow effect
            Positioned(
              top: -100,
              left: -100,
              child: Container(
                width: 400,
                height: 400,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [AppColors.primary.withValues(alpha: 0.08), Colors.transparent],
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: -50,
              right: -100,
              child: Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [AppColors.agentFaham.withValues(alpha: 0.06), Colors.transparent],
                  ),
                ),
              ),
            ),

            // Agent dots scattered
            ..._buildAgentDots(),

            // Main content
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Logo
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      borderRadius: BorderRadius.circular(28),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withValues(alpha: 0.4),
                          blurRadius: 30,
                          spreadRadius: 5,
                        ),
                      ],
                    ),
                    child: Center(
                      child: Text(
                        'خ',
                        style: GoogleFonts.notoNaskhArabic(
                          color: Colors.white,
                          fontSize: 48,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  )
                      .animate(onPlay: (c) => c.repeat(reverse: true))
                      .scaleXY(begin: 0.95, end: 1.0, duration: 2000.ms, curve: Curves.easeInOut),

                  const SizedBox(height: 28),

                  // Title
                  Text(
                    'خدمت',
                    style: GoogleFonts.notoNaskhArabic(
                      color: AppColors.primary,
                      fontSize: 52,
                      fontWeight: FontWeight.w700,
                      height: 1.1,
                    ),
                  )
                      .animate()
                      .fadeIn(delay: 400.ms, duration: 600.ms)
                      .slideY(begin: 0.3, end: 0, delay: 400.ms, duration: 600.ms),

                  Text(
                    'KHIDMAT',
                    style: GoogleFonts.inter(
                      color: AppColors.textPrimary,
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 6,
                    ),
                  )
                      .animate()
                      .fadeIn(delay: 600.ms, duration: 600.ms),

                  const SizedBox(height: 12),

                  Text(
                    'AI Service Orchestrator',
                    style: GoogleFonts.inter(
                      color: AppColors.textSecondary,
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                      letterSpacing: 1,
                    ),
                  )
                      .animate()
                      .fadeIn(delay: 800.ms, duration: 600.ms),

                  const SizedBox(height: 8),
                  Text(
                    'Pakistan\'s Informal Economy, Automated',
                    style: GoogleFonts.inter(
                      color: AppColors.textMuted,
                      fontSize: 12,
                    ),
                  )
                      .animate()
                      .fadeIn(delay: 1000.ms, duration: 600.ms),

                  const SizedBox(height: 48),

                  // Agent pipeline preview
                  _buildAgentPipeline()
                      .animate()
                      .fadeIn(delay: 1200.ms, duration: 800.ms),

                  const SizedBox(height: 60),

                  // Tagline
                  Text(
                    'Aapki khidmat mein, hamesha.',
                    style: GoogleFonts.inter(
                      color: AppColors.textMuted,
                      fontSize: 13,
                      fontStyle: FontStyle.italic,
                    ),
                  )
                      .animate()
                      .fadeIn(delay: 1500.ms, duration: 800.ms),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAgentPipeline() {
    final agents = [
      ('FAHAM', AppColors.agentFaham),
      ('DHOOND', AppColors.agentDhoond),
      ('BHAROSA', AppColors.agentBharosa),
      ('MOL-BHAAV', AppColors.agentMolBhaav),
      ('BOOK', AppColors.agentBook),
    ];

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: agents.asMap().entries.map((e) {
        final i = e.key;
        final (name, color) = e.value;
        return Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: color.withValues(alpha: 0.3)),
              ),
              child: Text(
                name,
                style: GoogleFonts.inter(
                  color: color,
                  fontSize: 9,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.3,
                ),
              ),
            )
                .animate(onPlay: (c) => c.repeat())
                .shimmer(
                  delay: (i * 300).ms,
                  duration: 1500.ms,
                  color: color.withValues(alpha: 0.3),
                ),
            if (i < agents.length - 1)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 3),
                child: Icon(Icons.arrow_forward, color: AppColors.textMuted, size: 10),
              ),
          ],
        );
      }).toList(),
    );
  }

  List<Widget> _buildAgentDots() {
    final positions = [
      (0.1, 0.2, AppColors.agentFaham),
      (0.9, 0.15, AppColors.agentDhoond),
      (0.05, 0.75, AppColors.agentBharosa),
      (0.92, 0.7, AppColors.agentMolBhaav),
      (0.5, 0.05, AppColors.agentBook),
    ];

    return positions.map((pos) {
      final (x, y, color) = pos;
      return Positioned(
        left: MediaQuery.of(context).size.width * x,
        top: MediaQuery.of(context).size.height * y,
        child: Container(
          width: 6,
          height: 6,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.4),
            shape: BoxShape.circle,
            boxShadow: [BoxShadow(color: color.withValues(alpha: 0.3), blurRadius: 6)],
          ),
        )
            .animate(onPlay: (c) => c.repeat(reverse: true))
            .scaleXY(begin: 0.5, end: 1.5, duration: const Duration(seconds: 2), curve: Curves.easeInOut),
      );
    }).toList();
  }
}
