import { Inter_400Regular, Inter_500Medium, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/auth/AuthProvider';
import { CasesProvider } from '@/data/CasesProvider';
import { LockScreen } from '@/screens/LockScreen';
import { color } from '@/tokens';

function AppShell() {
  const { status } = useAuth();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: color.background },
        }}
      >
        <Stack.Screen
          name="cases/[id]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackButtonDisplayMode: 'minimal',
            headerShadowVisible: false,
            headerTintColor: color.textPrimary,
            headerStyle: { backgroundColor: color.background },
          }}
        />
        <Stack.Screen
          name="deny/[id]"
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.6],
            sheetGrabberVisible: true,
          }}
        />
      </Stack>

      {status !== 'unlocked' ? (
        <View style={StyleSheet.absoluteFill}>
          {status === 'locked' ? <LockScreen /> : <View style={styles.splash} />}
        </View>
      ) : null}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
          <CasesProvider>
            <AppShell />
          </CasesProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  splash: {
    backgroundColor: color.background,
    flex: 1,
  },
});
