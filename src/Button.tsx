import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
  variant: ButtonVariant;
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  variant = 'primary',
  onPress,
  children,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyle =
    variant === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const buttonTextStyle =
    variant === 'primary'
      ? styles.primaryButtonText
      : styles.secondaryButtonText;

  return (
    <TouchableOpacity style={[buttonStyle, style]} onPress={onPress}>
      <Text style={[buttonTextStyle, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d6ebff',
  },
  secondaryButtonText: {
    color: '#4a90e2',
    fontSize: 14,
    fontWeight: '600',
  },
});
