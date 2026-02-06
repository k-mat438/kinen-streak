import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { useAppData } from '../hooks/useAppData';
import { useI18n, LANGUAGE_NAMES } from '../i18n';
import { exportDataAsJson } from '../utils/storage';
import { LanguagePicker } from '../components/LanguagePicker';

export function SettingsScreen() {
  const { data, resetData } = useAppData();
  const { t, language } = useI18n();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const handleExport = async () => {
    const json = exportDataAsJson(data);
    try {
      await Share.share({
        message: json,
        title: 'Kinen Streak Data',
      });
    } catch (error) {
      Alert.alert(t.settings.exportFailed, t.settings.exportFailedMessage);
    }
  };

  const handleReset = () => {
    Alert.alert(
      t.settings.resetTitle,
      t.settings.resetMessage,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.settings.resetConfirm,
          style: 'destructive',
          onPress: async () => {
            await resetData();
            Alert.alert(t.settings.dataReset, t.settings.dataCleared);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Language Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.settings.language}</Text>
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => setShowLanguagePicker(true)}
        >
          <Text style={styles.settingLabel}>{t.settings.language}</Text>
          <Text style={styles.settingValue}>{LANGUAGE_NAMES[language]}</Text>
        </TouchableOpacity>
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.settings.data}</Text>
        <TouchableOpacity style={styles.settingRow} onPress={handleExport}>
          <Text style={styles.settingLabel}>{t.settings.exportData}</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.settingRow, styles.dangerRow]}
          onPress={handleReset}
        >
          <Text style={styles.dangerText}>{t.settings.resetAllData}</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.settings.about}</Text>
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutText}>Kinen Streak</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </View>

      {/* Language Picker Modal */}
      <LanguagePicker
        visible={showLanguagePicker}
        onClose={() => setShowLanguagePicker(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    padding: 16,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
  settingArrow: {
    fontSize: 16,
    color: '#CCC',
  },
  dangerRow: {
    marginTop: 8,
  },
  dangerText: {
    fontSize: 16,
    color: '#E74C3C',
  },
  aboutContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});
