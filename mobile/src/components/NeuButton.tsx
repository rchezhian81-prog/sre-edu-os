import React, { useState } from 'react';
import { TouchableWithoutFeedback, View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { NEU, RADIUS, FONT } from '@/constants/theme';

interface Props {
  label: string;
  onPress: () => void | Promise<void>;
  accent?: string;
  disabled?: boolean;
  style?: ViewStyle;
  loading?: boolean;
  variant?: 'filled' | 'ghost';
}

export function NeuButton({ label, onPress, accent = '#1871E9', disabled, style, loading, variant = 'filled' }: Props) {
  const [pressed, setPressed] = useState(false);

  const handlePress = async () => {
    setPressed(true);
    await onPress();
    setTimeout(() => setPressed(false), 150);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress} disabled={disabled || loading}>
      <View style={[
        styles.btn,
        variant === 'filled' && { backgroundColor: accent },
        variant === 'ghost' && styles.ghost,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
        {loading
          ? <ActivityIndicator color={variant === 'filled' ? '#fff' : accent} size="small" />
          : <Text style={[styles.label, variant === 'ghost' && { color: accent }]}>{label}</Text>
        }
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 4,
  },
  ghost: {
    backgroundColor: NEU.surface,
    borderWidth: 1.5,
    borderColor: '#A3B1C6',
  },
  pressed: {
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  disabled: { opacity: 0.5 },
  label: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FONT.md,
    letterSpacing: 0.5,
  },
});
