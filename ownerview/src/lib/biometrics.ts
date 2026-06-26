import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

/** Whether this device can unlock with Face ID / Touch ID / device biometrics. */
export async function isBiometricAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const [hasHardware, isEnrolled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ]);
    return hasHardware && isEnrolled;
  } catch {
    return false;
  }
}

/** Prompts the local biometric check. Returns true only on a successful match. */
export async function authenticateWithBiometrics(): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock OwnerView',
      fallbackLabel: 'Use passcode',
    });
    return result.success;
  } catch {
    return false;
  }
}
