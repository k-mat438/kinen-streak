import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Language, LANGUAGE_NAMES, useI18n } from '../i18n';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const LANGUAGES: Language[] = ['en', 'ja'];

export function LanguagePicker({ visible, onClose }: Props) {
  const { language, setLanguage, t } = useI18n();

  const handleSelect = async (lang: Language) => {
    await setLanguage(lang);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.settings.languageSelect}</Text>
          </View>

          <View style={styles.optionsList}>
            {LANGUAGES.map((lang) => {
              const isSelected = lang === language;
              return (
                <TouchableOpacity
                  key={lang}
                  style={[styles.optionItem, isSelected && styles.optionSelected]}
                  onPress={() => handleSelect(lang)}
                >
                  <Text
                    style={[styles.optionText, isSelected && styles.optionTextSelected]}
                  >
                    {LANGUAGE_NAMES[lang]}
                  </Text>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>{t.common.cancel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  optionsList: {
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  optionSelected: {
    backgroundColor: '#E8E8E8',
  },
  optionText: {
    fontSize: 17,
    color: '#1A1A1A',
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelText: {
    fontSize: 16,
    color: '#999',
  },
});
