import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RelapseTrigger } from '../types';
import { useI18n } from '../i18n';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (trigger?: RelapseTrigger, note?: string) => void;
}

const TRIGGER_KEYS: RelapseTrigger[] = [
  'stress',
  'social',
  'habit',
  'urge',
  'work',
  'boredom',
  'other',
];

export function RelapseTriggerModal({ visible, onClose, onSubmit }: Props) {
  const { t } = useI18n();
  const [otherNote, setOtherNote] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  const handleTriggerPress = (trigger: RelapseTrigger) => {
    if (trigger === 'other') {
      setShowOtherInput(true);
    } else {
      onSubmit(trigger);
      resetState();
    }
  };

  const handleOtherSubmit = () => {
    onSubmit('other', otherNote);
    resetState();
  };

  const handleSkip = () => {
    onSubmit(undefined);
    resetState();
  };

  const resetState = () => {
    setOtherNote('');
    setShowOtherInput(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <Text style={styles.title}>{t.trigger.title}</Text>
          <Text style={styles.subtitle}>{t.trigger.optional}</Text>

          {!showOtherInput ? (
            <>
              <View style={styles.triggerList}>
                {TRIGGER_KEYS.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.triggerButton}
                    onPress={() => handleTriggerPress(key)}
                  >
                    <Text style={styles.triggerText}>{t.trigger[key]}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>{t.trigger.skip}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.otherInputContainer}>
              <TextInput
                style={styles.otherInput}
                placeholder={t.trigger.whatHappened}
                value={otherNote}
                onChangeText={setOtherNote}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleOtherSubmit}
              />
              <View style={styles.otherButtons}>
                <TouchableOpacity
                  style={styles.otherCancelButton}
                  onPress={() => setShowOtherInput(false)}
                >
                  <Text style={styles.otherCancelText}>{t.trigger.back}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.otherSubmitButton}
                  onPress={handleOtherSubmit}
                >
                  <Text style={styles.otherSubmitText}>{t.trigger.done}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  triggerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  triggerButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
  },
  triggerText: {
    fontSize: 16,
    color: '#333',
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  skipText: {
    fontSize: 16,
    color: '#999',
  },
  otherInputContainer: {
    marginTop: 8,
  },
  otherInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  otherButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  otherCancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  otherCancelText: {
    fontSize: 16,
    color: '#666',
  },
  otherSubmitButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
  },
  otherSubmitText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});
