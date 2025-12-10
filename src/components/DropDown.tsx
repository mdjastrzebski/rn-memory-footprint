import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';

export interface DropDownProps<T extends string> {
  label: string;
  value: T;
  options: T[];
  onSelect: (value: T) => void;
}

// DropDown Component
export function DropDown<T extends string>({
  label,
  value,
  options,
  onSelect,
}: DropDownProps<T>) {
  const [visible, setVisible] = useState(false);

  const handleSelect = (option: T) => {
    onSelect(option);
    setVisible(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.dropdownText}>{value}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            {options.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.modalItem}
                onPress={() => handleSelect(option)}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    value === option && styles.modalItemTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#2c5f8d',
    fontWeight: '600',
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d6ebff',
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 16,
    color: '#2c5f8d',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6b9dc9',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 95, 141, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '80%',
    maxWidth: 320,
    overflow: 'hidden',
    shadowColor: '#2c5f8d',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8f4fd',
  },
  modalItemText: {
    fontSize: 16,
    color: '#2c5f8d',
    fontWeight: '500',
  },
  modalItemTextSelected: {
    color: '#4a90e2',
    fontWeight: '700',
  },
});
