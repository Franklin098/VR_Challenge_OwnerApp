import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ActionButton } from '@/components/ActionButton';
import { AppText } from '@/components/AppText';
import { useCases } from '@/data/CasesProvider';
import { successHaptic } from '@/lib/haptics';
import { color, layout, radius, spacing } from '@/tokens';

/**
 * Native form-sheet for denying a case. A reason is required — that captured note
 * is what the owner leaves on the case, so there's no separate comment thread.
 */
export default function DenyCaseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { deny } = useCases();

  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = reason.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await deny(id, reason.trim());
      successHaptic();
      router.back();
    } catch {
      Alert.alert('Could not deny', 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <AppText variant="sectionHeader">Deny this case</AppText>
          <AppText variant="meta" color={color.textSecondary}>
            Add a reason for the owner&apos;s records.
          </AppText>
        </View>

        <TextInput
          style={styles.input}
          placeholder="e.g. I'll handle this directly on my next visit"
          placeholderTextColor={color.textMuted}
          value={reason}
          onChangeText={setReason}
          multiline
          autoFocus
          textAlignVertical="top"
        />

        <View style={styles.actions}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <AppText variant="value" color={color.textSecondary}>
              Cancel
            </AppText>
          </Pressable>
          <View style={styles.submit}>
            <ActionButton
              label="Submit denial"
              variant="deny"
              onPress={handleSubmit}
              disabled={!canSubmit}
              loading={isSubmitting}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.surface,
    flex: 1,
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    padding: layout.screenPaddingH,
  },
  header: {
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  input: {
    backgroundColor: color.surfaceInset,
    borderRadius: radius.field,
    color: color.textPrimary,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    minHeight: 120,
    padding: spacing.lg,
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'space-between',
  },
  submit: {
    flex: 1,
    maxWidth: 200,
  },
});
