import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nProvider } from './src/i18n';
import { AppDataProvider } from './src/hooks/useAppData';
import { Navigation } from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <AppDataProvider>
          <Navigation />
          <StatusBar style="dark" />
        </AppDataProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
