import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface NumericTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export function NumericTextInput({
  label,
  value,
  onChangeText,
  placeholder = 'Enter number',
  style,
  inputStyle,
}: NumericTextInputProps) {
  const isValid = value.trim() !== '' && /^\d+$/.test(value);

  const handleChange = (text: string) => {
    // Allow empty string or numeric values only
    if (text === '' || /^\d+$/.test(text)) {
      onChangeText(text);
    }
  };

  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        style={[
          styles.textInput,
          !isValid && styles.textInputError,
          inputStyle,
        ]}
        value={value}
        onChangeText={handleChange}
        keyboardType="numeric"
        placeholder={placeholder}
        placeholderTextColor="#9bb8d3"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: '#2c5f8d',
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2c5f8d',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#d6ebff',
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  textInputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
    shadowColor: '#e74c3c',
    shadowOpacity: 0.15,
  },
});
