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
import { RelapseTrigger, Contract } from '../types';
import { useI18n } from '../i18n';
import { SelfPenaltyCard } from './SelfPenaltyCard';
import { DonationLinkCard } from './DonationLinkCard';

interface Props {
  visible: boolean;
  contract: Contract | null;
  onClose: () => void;
  onSubmit: (trigger?: RelapseTrigger, note?: string) => void;
  onPunishmentComplete: () => void;
  onRetry: () => void;
  onStartOver: () => void;
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

type Step = 'trigger' | 'other-input' | 'punishment' | 'choice';

export function FailureModal({ visible, contract, onClose, onSubmit, onPunishmentComplete, onRetry, onStartOver }: Props) {
  const { t } = useI18n();
  const [step, setStep] = useState<Step>('trigger');
  const [selectedTrigger, setSelectedTrigger] = useState<RelapseTrigger | undefined>();
  const [otherNote, setOtherNote] = useState('');

  const handleTriggerPress = (trigger: RelapseTrigger) => {
    setSelectedTrigger(trigger);
    if (trigger === 'other') {
      setStep('other-input');
    } else {
      // Submit failure and show punishment
      onSubmit(trigger, undefined);
      setStep('punishment');
    }
  };

  const handleOtherSubmit = () => {
    onSubmit(selectedTrigger, otherNote);
    setStep('punishment');
  };

  const handleSkipTrigger = () => {
    setSelectedTrigger(undefined);
    onSubmit(undefined, undefined);
    setStep('punishment');
  };

  const handlePunishmentComplete = () => {
    onPunishmentComplete();
    setStep('choice');
  };

  const handleRetry = () => {
    resetState();
    onClose();
    onRetry();
  };

  const handleStartOver = () => {
    resetState();
    onClose();
    onStartOver();
  };

  const handleClose = () => {
    // Cannot close during punishment - must complete it
    // Choice step requires selecting an option
  };

  const resetState = () => {
    setStep('trigger');
    setSelectedTrigger(undefined);
    setOtherNote('');
  };

  const handleBack = () => {
    if (step === 'other-input') {
      setStep('trigger');
    }
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
          {step === 'trigger' && (
            <>
              <Text style={styles.title}>{t.trigger.title}</Text>
              <Text style={styles.subtitle}>{t.trigger.optional}</Text>

              <View style={styles.optionList}>
                {TRIGGER_KEYS.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.optionButton}
                    onPress={() => handleTriggerPress(key)}
                  >
                    <Text style={styles.optionText}>{t.trigger[key]}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.skipButton} onPress={handleSkipTrigger}>
                <Text style={styles.skipText}>{t.trigger.skip}</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'other-input' && (
            <View style={styles.otherInputContainer}>
              <Text style={styles.title}>{t.trigger.whatHappened}</Text>
              <TextInput
                style={styles.otherInput}
                placeholder={t.trigger.whatHappened}
                value={otherNote}
                onChangeText={setOtherNote}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleOtherSubmit}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBack}
                >
                  <Text style={styles.backButtonText}>{t.trigger.back}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleOtherSubmit}
                >
                  <Text style={styles.submitButtonText}>{t.trigger.done}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === 'punishment' && contract && (
            <>
              {contract.punishmentLevel === 'light' && contract.selfPenaltyTask && (
                <SelfPenaltyCard
                  task={contract.selfPenaltyTask}
                  customDescription={contract.selfPenaltyCustom}
                  onCompleted={handlePunishmentComplete}
                />
              )}

              {contract.punishmentLevel === 'medium' && contract.donationCategory && (
                <DonationLinkCard
                  category={contract.donationCategory}
                  amount={contract.donationAmount || 500}
                  onDonated={handlePunishmentComplete}
                />
              )}
            </>
          )}

          {step === 'choice' && (
            <>
              <Text style={styles.title}>{t.punishment.whatNext}</Text>
              <Text style={styles.subtitle}>{t.punishment.chooseAction}</Text>

              <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>{t.punishment.retry}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.startOverButton} onPress={handleStartOver}>
                <Text style={styles.startOverButtonText}>{t.punishment.startOver}</Text>
              </TouchableOpacity>
            </>
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
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  optionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 16,
  },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
  },
  optionText: {
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
    marginTop: 16,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  startOverButton: {
    marginTop: 12,
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
  },
  startOverButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});
