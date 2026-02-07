import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from './src/navigation';
import { AppDataProvider } from './src/hooks/useAppData';
import { I18nProvider } from './src/i18n';

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
