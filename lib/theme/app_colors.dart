import 'package:flutter/material.dart';

class AppColors {
  // ─── Brand Primary ───
  static const Color primary = Color(0xFF00C896);
  static const Color primaryDark = Color(0xFF00A07A);
  static const Color primaryLight = Color(0xFF4DFFC4);
  static const Color primaryContainer = Color(0xFF003D2E);
  static const Color onPrimary = Color(0xFF001A12);
  static const Color onPrimaryContainer = Color(0xFF4DFFC4);

  // ─── Background / Surface ───
  static const Color background = Color(0xFF080E0C);
  static const Color surface = Color(0xFF10191A);
  static const Color surfaceElevated = Color(0xFF172120);
  static const Color surfaceCard = Color(0xFF1C2A28);
  static const Color surfaceHighest = Color(0xFF243330);
  static const Color divider = Color(0xFF1F2F2C);

  // ─── Text ───
  static const Color textPrimary = Color(0xFFE2EFEA);
  static const Color textSecondary = Color(0xFF7EA99A);
  static const Color textMuted = Color(0xFF4A6B5E);
  static const Color textOnDark = Color(0xFFE2EFEA);

  // ─── Semantic ───
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);

  // ─── Agent Identity Colors ───
  static const Color agentFaham = Color(0xFF3B82F6);
  static const Color agentFahamBg = Color(0xFF0D1C35);
  static const Color agentFahamGlow = Color(0x4D3B82F6);

  static const Color agentDhoond = Color(0xFFF59E0B);
  static const Color agentDhoondBg = Color(0xFF2A1D00);
  static const Color agentDhoondGlow = Color(0x4DF59E0B);

  static const Color agentBharosa = Color(0xFF10B981);
  static const Color agentBharosaBg = Color(0xFF052918);
  static const Color agentBharosaGlow = Color(0x4D10B981);

  static const Color agentMolBhaav = Color(0xFF8B5CF6);
  static const Color agentMolBhaavBg = Color(0xFF1A0D35);
  static const Color agentMolBhaavGlow = Color(0x4D8B5CF6);

  static const Color agentBook = Color(0xFF14B8A6);
  static const Color agentBookBg = Color(0xFF042520);
  static const Color agentBookGlow = Color(0x4D14B8A6);

  static const Color agentYaadDahani = Color(0xFFF97316);
  static const Color agentYaadDahaniBg = Color(0xFF2A1000);
  static const Color agentYaadDahaniGlow = Color(0x4DF97316);

  // ─── Trust Score Colors ───
  static const Color trustHigh = Color(0xFF10B981);
  static const Color trustMedium = Color(0xFFF59E0B);
  static const Color trustLow = Color(0xFFEF4444);

  // ─── Glass Morphism ───
  static const Color glassSurface = Color(0x1AFFFFFF);
  static const Color glassBorder = Color(0x26FFFFFF);
  static const Color glassOverlay = Color(0x80000000);

  // ─── Gradient ───
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF00C896), Color(0xFF008F6B)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient darkGradient = LinearGradient(
    colors: [Color(0xFF0A1410), Color(0xFF172120)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient cardGradient = LinearGradient(
    colors: [Color(0xFF1C2A28), Color(0xFF172120)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static LinearGradient agentGradient(Color color) => LinearGradient(
    colors: [color.withValues(alpha: 0.15), color.withValues(alpha: 0.05)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
