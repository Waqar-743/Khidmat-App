import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '../src/constants';

const FAQS = [
  {
    question: 'How do I track my service request?',
    answer: 'You can track your service request by navigating to the "Activity" tab in the bottom navigation bar. All active and past requests will be listed there with their current status.',
  },
  {
    question: 'What forms of payment are accepted?',
    answer: 'We accept JazzCash, EasyPaisa, major credit/debit cards, and direct bank transfers. Cash on delivery is also available for specific services.',
  },
  {
    question: 'How accurate is the AI Trust Score?',
    answer: 'Our Trust Score indicates the confidence level of the AI\'s response based on verified data sources. High Trust means the information is cross-checked with official databases.',
    hasTrustBadge: true,
  },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="smart-toy" size={20} color={Colors.onPrimaryContainer} />
          </View>
          <Text style={styles.headerTitle}>KHIDMAT Agent</Text>
        </View>
        <TouchableOpacity style={styles.moreButton} onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color={Colors.onPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>How can we help you?</Text>
          <Text style={styles.heroSubtitle}>Find answers, reach out to our team, or report an issue.</Text>
        </View>

        {/* Quick Contact Bento Grid */}
        <View style={styles.contactGrid}>
          {/* Chat Card */}
          <TouchableOpacity style={styles.chatCard}>
            <View style={styles.chatIconBg}>
              <MaterialIcons name="chat" size={28} color={Colors.onSecondaryContainer} />
            </View>
            <Text style={styles.chatTitle}>Chat with Support</Text>
            <Text style={styles.chatSubtitle}>Instant help from our AI agent or a live human representative.</Text>
            <Text style={styles.chatLink}>Start Chat →</Text>
          </TouchableOpacity>

          {/* Contact Options Stack */}
          <View style={styles.contactStack}>
            {/* WhatsApp */}
            <TouchableOpacity style={styles.contactOptionCard}>
              <View style={[styles.contactOptionIconBg, { backgroundColor: 'rgba(37, 211, 102, 0.2)' }]}>
                <MaterialIcons name="forum" size={20} color="#25D366" />
              </View>
              <View style={styles.contactOptionInfo}>
                <Text style={styles.contactOptionTitle}>WhatsApp Support</Text>
                <Text style={styles.contactOptionSubtitle}>+92 300 1234567</Text>
              </View>
            </TouchableOpacity>

            {/* Phone */}
            <TouchableOpacity style={styles.contactOptionCard}>
              <View style={[styles.contactOptionIconBg, { backgroundColor: 'rgba(154, 237, 207, 0.2)' }]}>
                <MaterialIcons name="call" size={20} color={Colors.primaryContainer} />
              </View>
              <View style={styles.contactOptionInfo}>
                <Text style={styles.contactOptionTitle}>Call Center</Text>
                <Text style={styles.contactOptionSubtitle}>111-KHIDMAT (5443628)</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.faqSectionTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.faqList}>
            {FAQS.map((faq, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <View key={index} style={styles.faqItem}>
                  <TouchableOpacity style={styles.faqHeader} onPress={() => toggleFaq(index)} activeOpacity={0.7}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <MaterialIcons 
                      name={isExpanded ? "expand-less" : "expand-more"} 
                      size={24} 
                      color={Colors.onSurface} 
                    />
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <View style={styles.faqAnswerContainer}>
                      {faq.hasTrustBadge && (
                        <View style={styles.trustBadge}>
                          <Text style={styles.trustBadgeText}>High Trust</Text>
                        </View>
                      )}
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
          
          <TouchableOpacity style={styles.viewAllFaqsBtn}>
            <Text style={styles.viewAllFaqsText}>View all FAQs</Text>
          </TouchableOpacity>
        </View>

        {/* Report Issue Form */}
        <View style={styles.reportSection}>
          <View style={styles.reportHeader}>
            <MaterialIcons name="report-problem" size={24} color={Colors.error} />
            <Text style={styles.reportTitle}>Report an Issue</Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Issue Type</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>App Performance / Bug</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color={Colors.onSurfaceVariant} />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Please describe the issue in detail..."
              placeholderTextColor={Colors.onSurfaceVariant}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Submit Report</Text>
            <MaterialIcons name="send" size={18} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56, // For safe area in expo router modals without header
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    ...Elevation.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.headlineMd,
    color: Colors.onPrimary,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.xl,
  },
  // Hero Section
  heroSection: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  heroTitle: {
    ...Typography.headlineLgMobile,
    color: Colors.primary,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...Typography.bodyLg,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  // Bento Grid
  contactGrid: {
    flexDirection: 'column', // Since react native, better to stack on mobile by default or use flex-row if width allows
    gap: Spacing.md,
  },
  chatCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Elevation.sm,
  },
  chatIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  chatTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  chatSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  chatLink: {
    ...Typography.bodyMd,
    marginTop: Spacing.sm,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  contactStack: {
    gap: Spacing.sm,
    flexDirection: 'column',
  },
  contactOptionCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    ...Elevation.sm,
  },
  contactOptionIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactOptionInfo: {
    flex: 1,
  },
  contactOptionTitle: {
    ...Typography.bodyLg,
    fontWeight: 'bold',
    color: Colors.onSurface,
  },
  contactOptionSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  // FAQ Section
  faqSection: {
    gap: Spacing.md,
  },
  faqSectionTitle: {
    ...Typography.headlineMd,
    color: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    paddingBottom: Spacing.xs,
  },
  faqList: {
    gap: Spacing.sm,
  },
  faqItem: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  faqQuestion: {
    ...Typography.bodyLg,
    fontWeight: 'bold',
    color: Colors.onSurface,
    flex: 1,
    marginRight: Spacing.sm,
  },
  faqAnswerContainer: {
    padding: Spacing.md,
    paddingTop: 0,
  },
  trustBadge: {
    backgroundColor: Colors.secondaryContainer,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.xs,
  },
  trustBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.onSecondaryContainer,
  },
  faqAnswer: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  viewAllFaqsBtn: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  viewAllFaqsText: {
    ...Typography.bodyMd,
    color: Colors.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  // Report Section
  reportSection: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: Spacing.md,
    ...Elevation.sm,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    paddingBottom: Spacing.sm,
  },
  reportTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  formGroup: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.codeSm,
    fontWeight: 'bold',
    color: Colors.onSurface,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    height: 44,
  },
  inputText: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    color: Colors.onSurface,
    ...Typography.bodyMd,
    minHeight: 100,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    ...Elevation.sm,
  },
  submitBtnText: {
    ...Typography.bodyLg,
    color: Colors.onPrimary,
    fontWeight: 'bold',
  },
});
