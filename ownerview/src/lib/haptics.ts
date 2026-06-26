import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Haptics are a no-op on web; never let them throw into the UI. */

export function successHaptic(): void {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function selectionHaptic(): void {
  if (Platform.OS === 'web') return;
  Haptics.selectionAsync().catch(() => {});
}
