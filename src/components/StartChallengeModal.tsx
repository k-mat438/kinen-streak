import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { QuitReason, DEFAULT_GOAL_DAYS } from '../types';
import { useI18n } from '../i18n';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: QuitReason, goalDays: number) => void;
}

const REASON_KEYS: QuitReason[] = [
  'health',
  'money',
  'family',
  'smell',
  'freedom',
  'fitness',
  'other',
];

const GOAL_OPTIONS = [7, 14, 30, 60, 90, 365];

export function StartChallengeModal({ visible, onClose, onSubmit }: Props) {
  const { t } = useI18n();
  const [step, setStep] = useState<'reason' | 'goal'>('reason');
  const [selectedReason, setSelectedReason] = useState<QuitReason | null>(null);
  const [selectedGoal, setSelectedGoal] = useState(DEFAULT_GOAL_DAYS);

  const handleReasonSelect = (reason: QuitReason) => {
    setSelectedReason(reason);
    setStep('goal');
  };

  const handleGoalSelect = (days: number) => {
    setSelectedGoal(days);
  };

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason, selectedGoal);
      resetState();
    }
  };

  const resetState = () => {
    setStep('reason');
    setSelectedReason(null);
    setSelectedGoal(DEFAULT_GOAL_DAYS);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleBack = () => {
    setStep('reason');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {step === 'reason' ? (
            <>
              <Text style={styles.title}>{t.start.reasonTitle}</Text>
              <Text style={styles.subtitle}>{t.start.reasonSubtitle}</Text>

              <View style={styles.optionList}>
                {REASON_KEYS.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.optionButton}
                    onPress={() => handleReasonSelect(key)}
                  >
                    <Text style={styles.optionText}>{t.start[key]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>{t.start.goalTitle}</Text>
              <Text style={styles.subtitle}>{t.start.goalSubtitle}</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.goalScrollContent}
              >
                {GOAL_OPTIONS.map((days) => (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.goalButton,
                      selectedGoal === days && styles.goalButtonSelected,
                    ]}
                    onPress={() => handleGoalSelect(days)}
                  >
                    <Text
                      style={[
                        styles.goalValue,
                        selectedGoal === days && styles.goalValueSelected,
                      ]}
                    >
                      {days}
                    </Text>
                    <Text
                      style={[
                        styles.goalLabel,
                        selectedGoal === days && styles.goalLabelSelected,
                      ]}
                    >
                      {t.start.days}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBack}
                >
                  <Text style={styles.backButtonText}>{t.trigger.back}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>{t.start.letsGo}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
  goalScrollContent: {
    paddingVertical: 8,
    gap: 12,
  },
  goalButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalButtonSelected: {
    backgroundColor: '#1A1A1A',
  },
  goalValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  goalValueSelected: {
    color: '#FFF',
  },
  goalLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  goalLabelSelected: {
    color: '#CCC',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});
