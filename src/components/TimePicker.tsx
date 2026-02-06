import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { formatBoundaryTime } from '../utils/date';

interface Props {
  visible: boolean;
  currentHour: number;
  currentMinute: number;
  onClose: () => void;
  onSelect: (hour: number, minute: number) => void;
}

// Generate time options (30-minute intervals)
function generateTimeOptions(): { hour: number; minute: number }[] {
  const options: { hour: number; minute: number }[] = [];
  for (let hour = 0; hour < 24; hour++) {
    options.push({ hour, minute: 0 });
    options.push({ hour, minute: 30 });
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions();

export function TimePicker({
  visible,
  currentHour,
  currentMinute,
  onClose,
  onSelect,
}: Props) {
  const [selectedHour, setSelectedHour] = useState(currentHour);
  const [selectedMinute, setSelectedMinute] = useState(currentMinute);

  const handleSelect = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
  };

  const handleConfirm = () => {
    onSelect(selectedHour, selectedMinute);
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
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Day resets at</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
            {TIME_OPTIONS.map(({ hour, minute }) => {
              const isSelected = hour === selectedHour && minute === selectedMinute;
              return (
                <TouchableOpacity
                  key={`${hour}-${minute}`}
                  style={[styles.optionItem, isSelected && styles.optionSelected]}
                  onPress={() => handleSelect(hour, minute)}
                >
                  <Text
                    style={[styles.optionText, isSelected && styles.optionTextSelected]}
                  >
                    {formatBoundaryTime(hour, minute)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
    maxHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cancelText: {
    fontSize: 16,
    color: '#999',
  },
  doneText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  optionsList: {
    padding: 8,
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: '#F0F0F0',
  },
  optionText: {
    fontSize: 17,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  optionTextSelected: {
    fontWeight: '600',
  },
});
