import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  BehaviorCategory,
  ContractGranularity,
  PunishmentLevel,
  SelfPenaltyTask,
  DonationCategory,
  BLOCK_DURATION_PRESETS,
  DONATION_AMOUNT_PRESETS,
} from '../types';
import { useI18n } from '../i18n';
import { formatBlockDuration } from '../utils/date';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (params: {
    behavior: BehaviorCategory;
    behaviorCustomName?: string;
    granularity: ContractGranularity;
    blockDurationMinutes?: number;
    punishmentLevel: PunishmentLevel;
    selfPenaltyTask?: SelfPenaltyTask;
    selfPenaltyCustom?: string;
    donationCategory?: DonationCategory;
    donationAmount?: number;
  }) => void;
}

type Step = 'behavior' | 'behavior-custom' | 'granularity' | 'block-duration' | 'punishment' | 'self-penalty' | 'donation' | 'confirm';

const BEHAVIOR_KEYS: BehaviorCategory[] = [
  'quit_smoking',
  'quit_sns',
  'quit_alcohol',
  'study',
  'exercise',
  'custom',
];

const SELF_PENALTY_KEYS: SelfPenaltyTask[] = [
  'exercise',
  'cleaning',
  'diary',
  'meditation',
  'pushups',
  'custom',
];

const DONATION_KEYS: DonationCategory[] = [
  'animal',
  'education',
  'environment',
  'health',
  'disaster',
];

export function CreateContractModal({ visible, onClose, onSubmit }: Props) {
  const { t } = useI18n();

  const [step, setStep] = useState<Step>('behavior');
  const [behavior, setBehavior] = useState<BehaviorCategory | null>(null);
  const [behaviorCustomName, setBehaviorCustomName] = useState('');
  const [granularity, setGranularity] = useState<ContractGranularity>('day');
  const [blockDuration, setBlockDuration] = useState<number>(60);
  const [customBlockDuration, setCustomBlockDuration] = useState('');
  const [showCustomDurationModal, setShowCustomDurationModal] = useState(false);
  const [punishmentLevel, setPunishmentLevel] = useState<PunishmentLevel>('light');
  const [selfPenaltyTask, setSelfPenaltyTask] = useState<SelfPenaltyTask>('pushups');
  const [selfPenaltyCustom, setSelfPenaltyCustom] = useState('');
  const [donationCategory, setDonationCategory] = useState<DonationCategory>('animal');
  const [donationAmount, setDonationAmount] = useState<number>(500);

  const resetState = () => {
    setStep('behavior');
    setBehavior(null);
    setBehaviorCustomName('');
    setGranularity('day');
    setBlockDuration(60);
    setCustomBlockDuration('');
    setShowCustomDurationModal(false);
    setPunishmentLevel('light');
    setSelfPenaltyTask('pushups');
    setSelfPenaltyCustom('');
    setDonationCategory('animal');
    setDonationAmount(500);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleBehaviorSelect = (b: BehaviorCategory) => {
    setBehavior(b);
    if (b === 'custom') {
      setStep('behavior-custom');
    } else {
      setStep('granularity');
    }
  };

  const handleBehaviorCustomSubmit = () => {
    setStep('granularity');
  };

  const handleGranularitySelect = (g: ContractGranularity) => {
    setGranularity(g);
    if (g === 'hour') {
      setStep('block-duration');
    } else {
      setStep('punishment');
    }
  };

  const handleBlockDurationSelect = (minutes: number) => {
    setBlockDuration(minutes);
    setStep('punishment');
  };

  const handleCustomBlockDurationSubmit = () => {
    const minutes = parseInt(customBlockDuration, 10);
    if (minutes > 0) {
      setBlockDuration(minutes);
      setShowCustomDurationModal(false);
      setStep('punishment');
    }
  };

  const handlePunishmentSelect = (level: PunishmentLevel) => {
    setPunishmentLevel(level);
    if (level === 'light') {
      setStep('self-penalty');
    } else if (level === 'medium') {
      setStep('donation');
    } else {
      // strong - coming soon, go to confirm
      setStep('confirm');
    }
  };

  const handleSelfPenaltySelect = (task: SelfPenaltyTask) => {
    setSelfPenaltyTask(task);
    if (task === 'custom') {
      // Show input, but for now just proceed
    }
    setStep('confirm');
  };

  const handleDonationSelect = (category: DonationCategory) => {
    setDonationCategory(category);
    setStep('confirm');
  };

  const handleSubmit = () => {
    if (!behavior) return;

    onSubmit({
      behavior,
      behaviorCustomName: behavior === 'custom' ? behaviorCustomName : undefined,
      granularity,
      blockDurationMinutes: granularity === 'hour' ? blockDuration : undefined,
      punishmentLevel,
      selfPenaltyTask: punishmentLevel === 'light' ? selfPenaltyTask : undefined,
      selfPenaltyCustom: punishmentLevel === 'light' && selfPenaltyTask === 'custom' ? selfPenaltyCustom : undefined,
      donationCategory: punishmentLevel === 'medium' ? donationCategory : undefined,
      donationAmount: punishmentLevel === 'medium' ? donationAmount : undefined,
    });
    resetState();
  };

  const handleBack = () => {
    switch (step) {
      case 'behavior-custom':
        setStep('behavior');
        break;
      case 'granularity':
        if (behavior === 'custom') {
          setStep('behavior-custom');
        } else {
          setStep('behavior');
        }
        break;
      case 'block-duration':
        setStep('granularity');
        break;
      case 'punishment':
        if (granularity === 'hour') {
          setStep('block-duration');
        } else {
          setStep('granularity');
        }
        break;
      case 'self-penalty':
      case 'donation':
        setStep('punishment');
        break;
      case 'confirm':
        if (punishmentLevel === 'light') {
          setStep('self-penalty');
        } else if (punishmentLevel === 'medium') {
          setStep('donation');
        } else {
          setStep('punishment');
        }
        break;
    }
  };

  const getBehaviorDisplayName = () => {
    if (!behavior) return '';
    if (behavior === 'custom') return behaviorCustomName || t.contract.custom;
    return t.contract.behaviors[behavior];
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
          {/* Step: Behavior Selection */}
          {step === 'behavior' && (
            <>
              <Text style={styles.title}>{t.contract.selectBehavior}</Text>
              <Text style={styles.subtitle}>{t.contract.whatToCommit}</Text>
              <View style={styles.optionList}>
                {BEHAVIOR_KEYS.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.optionButton}
                    onPress={() => handleBehaviorSelect(key)}
                  >
                    <Text style={styles.optionText}>{t.contract.behaviors[key]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Step: Custom Behavior Input */}
          {step === 'behavior-custom' && (
            <View style={styles.inputContainer}>
              <Text style={styles.title}>{t.contract.customBehavior}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={t.contract.customPlaceholder}
                value={behaviorCustomName}
                onChangeText={setBehaviorCustomName}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleBehaviorCustomSubmit}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Text style={styles.backButtonText}>{t.common.back}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, !behaviorCustomName && styles.submitButtonDisabled]}
                  onPress={handleBehaviorCustomSubmit}
                  disabled={!behaviorCustomName}
                >
                  <Text style={styles.submitButtonText}>{t.common.next}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Step: Granularity Selection */}
          {step === 'granularity' && (
            <>
              <Text style={styles.title}>{t.contract.selectGranularity}</Text>
              <Text style={styles.subtitle}>{t.contract.howToTrack}</Text>
              <View style={styles.optionListVertical}>
                <TouchableOpacity
                  style={styles.bigOptionButton}
                  onPress={() => handleGranularitySelect('day')}
                >
                  <Text style={styles.bigOptionTitle}>{t.contract.dayMode}</Text>
                  <Text style={styles.bigOptionDesc}>{t.contract.dayModeDesc}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bigOptionButton}
                  onPress={() => handleGranularitySelect('hour')}
                >
                  <Text style={styles.bigOptionTitle}>{t.contract.hourMode}</Text>
                  <Text style={styles.bigOptionDesc}>{t.contract.hourModeDesc}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.backButtonSolo} onPress={handleBack}>
                <Text style={styles.backButtonText}>{t.common.back}</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Step: Block Duration Selection (hour mode only) */}
          {step === 'block-duration' && (
            <>
              <Text style={styles.title}>{t.contract.selectBlockDuration}</Text>
              <Text style={styles.subtitle}>{t.contract.blockDurationDesc}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.durationScrollContent}
              >
                {BLOCK_DURATION_PRESETS.map((minutes) => (
                  <TouchableOpacity
                    key={minutes}
                    style={[
                      styles.durationButton,
                      blockDuration === minutes && styles.durationButtonSelected,
                    ]}
                    onPress={() => handleBlockDurationSelect(minutes)}
                  >
                    <Text
                      style={[
                        styles.durationValue,
                        blockDuration === minutes && styles.durationValueSelected,
                      ]}
                    >
                      {formatBlockDuration(minutes)}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.durationButton}
                  onPress={() => setShowCustomDurationModal(true)}
                >
                  <Text style={styles.durationValue}>{t.contract.custom}</Text>
                </TouchableOpacity>
              </ScrollView>
              <TouchableOpacity style={styles.backButtonSolo} onPress={handleBack}>
                <Text style={styles.backButtonText}>{t.common.back}</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Step: Punishment Selection */}
          {step === 'punishment' && (
            <>
              <Text style={styles.title}>{t.contract.selectPunishment}</Text>
              <Text style={styles.subtitle}>{t.contract.whatIfFail}</Text>
              <View style={styles.optionListVertical}>
                <TouchableOpacity
                  style={styles.bigOptionButton}
                  onPress={() => handlePunishmentSelect('light')}
                >
                  <Text style={styles.bigOptionTitle}>{t.contract.lightPunishment}</Text>
                  <Text style={styles.bigOptionDesc}>{t.contract.lightPunishmentDesc}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bigOptionButton}
                  onPress={() => handlePunishmentSelect('medium')}
                >
                  <Text style={styles.bigOptionTitle}>{t.contract.mediumPunishment}</Text>
                  <Text style={styles.bigOptionDesc}>{t.contract.mediumPunishmentDesc}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.bigOptionButton, styles.bigOptionButtonDisabled]}
                  disabled
                >
                  <Text style={[styles.bigOptionTitle, styles.bigOptionTitleDisabled]}>
                    {t.contract.strongPunishment}
                  </Text>
                  <Text style={[styles.bigOptionDesc, styles.bigOptionDescDisabled]}>
                    {t.contract.comingSoon}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.backButtonSolo} onPress={handleBack}>
                <Text style={styles.backButtonText}>{t.common.back}</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Step: Self-Penalty Selection */}
          {step === 'self-penalty' && (
            <>
              <Text style={styles.title}>{t.contract.selectSelfPenalty}</Text>
              <Text style={styles.subtitle}>{t.contract.selfPenaltyDesc}</Text>
              <View style={styles.optionList}>
                {SELF_PENALTY_KEYS.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.optionButton,
                      selfPenaltyTask === key && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleSelfPenaltySelect(key)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selfPenaltyTask === key && styles.optionTextSelected,
                      ]}
                    >
                      {t.contract.selfPenalties[key]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.backButtonSolo} onPress={handleBack}>
                <Text style={styles.backButtonText}>{t.common.back}</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Step: Donation Selection */}
          {step === 'donation' && (
            <>
              <Text style={styles.title}>{t.contract.selectDonation}</Text>
              <Text style={styles.subtitle}>{t.contract.donationDesc}</Text>
              <View style={styles.optionList}>
                {DONATION_KEYS.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.optionButton,
                      donationCategory === key && styles.optionButtonSelected,
                    ]}
                    onPress={() => setDonationCategory(key)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        donationCategory === key && styles.optionTextSelected,
                      ]}
                    >
                      {t.contract.donations[key]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.amountLabel}>{t.contract.donationAmount}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.amountScrollContent}
              >
                {DONATION_AMOUNT_PRESETS.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.amountButton,
                      donationAmount === amount && styles.amountButtonSelected,
                    ]}
                    onPress={() => setDonationAmount(amount)}
                  >
                    <Text
                      style={[
                        styles.amountText,
                        donationAmount === amount && styles.amountTextSelected,
                      ]}
                    >
                      ¥{amount.toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Text style={styles.backButtonText}>{t.common.back}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={() => handleDonationSelect(donationCategory)}>
                  <Text style={styles.submitButtonText}>{t.common.next}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Step: Confirmation */}
          {step === 'confirm' && (
            <>
              <Text style={styles.title}>{t.contract.confirm}</Text>
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t.contract.targetBehavior}</Text>
                  <Text style={styles.summaryValue}>{getBehaviorDisplayName()}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t.contract.trackingMode}</Text>
                  <Text style={styles.summaryValue}>
                    {granularity === 'day' ? t.contract.dayMode : `${t.contract.hourMode} (${formatBlockDuration(blockDuration)})`}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t.contract.punishment}</Text>
                  <Text style={styles.summaryValue}>
                    {punishmentLevel === 'light'
                      ? t.contract.selfPenalties[selfPenaltyTask]
                      : `${t.contract.donations[donationCategory]} ¥${donationAmount.toLocaleString()}`}
                  </Text>
                </View>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Text style={styles.backButtonText}>{t.common.back}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>{t.contract.startContract}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Custom Duration Input Modal */}
      <Modal
        visible={showCustomDurationModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowCustomDurationModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.customModalOverlay}
        >
          <View style={styles.customModalContainer}>
            <Text style={styles.customModalTitle}>{t.contract.customDuration}</Text>
            <Text style={styles.customModalSubtitle}>{t.contract.customDurationDesc}</Text>
            <View style={styles.customDurationRow}>
              <TextInput
                style={styles.customDurationInput}
                placeholder="30"
                value={customBlockDuration}
                onChangeText={setCustomBlockDuration}
                keyboardType="number-pad"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleCustomBlockDurationSubmit}
              />
              <Text style={styles.customDurationUnit}>{t.contract.minutes}</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setShowCustomDurationModal(false)}
              >
                <Text style={styles.backButtonText}>{t.common.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, !customBlockDuration && styles.submitButtonDisabled]}
                onPress={handleCustomBlockDurationSubmit}
                disabled={!customBlockDuration}
              >
                <Text style={styles.submitButtonText}>{t.common.done}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    maxHeight: '85%',
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
  optionListVertical: {
    gap: 12,
    marginBottom: 16,
  },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
  },
  optionButtonSelected: {
    backgroundColor: '#1A1A1A',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#FFF',
  },
  bigOptionButton: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  bigOptionButtonDisabled: {
    opacity: 0.5,
  },
  bigOptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  bigOptionTitleDisabled: {
    color: '#999',
  },
  bigOptionDesc: {
    fontSize: 14,
    color: '#666',
  },
  bigOptionDescDisabled: {
    color: '#AAA',
  },
  inputContainer: {
    marginTop: 8,
  },
  textInput: {
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
    marginTop: 16,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  backButtonSolo: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
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
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  durationScrollContent: {
    paddingVertical: 8,
    gap: 12,
  },
  durationButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationButtonSelected: {
    backgroundColor: '#1A1A1A',
  },
  durationValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  durationValueSelected: {
    color: '#FFF',
  },
  customModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  customModalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  customModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  customModalSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  customDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 12,
  },
  customDurationInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    width: 120,
  },
  customDurationUnit: {
    fontSize: 18,
    color: '#666',
  },
  amountLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 20,
    marginBottom: 12,
  },
  amountScrollContent: {
    gap: 12,
  },
  amountButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
  },
  amountButtonSelected: {
    backgroundColor: '#1A1A1A',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  amountTextSelected: {
    color: '#FFF',
  },
  summaryBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
