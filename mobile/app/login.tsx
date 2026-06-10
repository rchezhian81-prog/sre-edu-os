import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { NeuButton } from '@/components/NeuButton';
import { NEU, FONT, RADIUS, ROLES, raiseShadow } from '@/constants/theme';

const schema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});
type Form = z.infer<typeof schema>;

export default function LoginScreen() {
  const { login } = useAuthStore();
  const router    = useRouter();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email, password }: Form) => {
    setLoading(true);
    try {
      await login(email, password);
      // _layout will redirect based on role
    } catch (e: any) {
      Alert.alert('Login failed', e?.response?.data?.message ?? 'Check your credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo area */}
        <View style={styles.logoWrap}>
          <View style={[styles.logo, raiseShadow('lg')]}>
            <Text style={styles.logoText}>SRE</Text>
            <Text style={styles.logoSub}>EDU OS</Text>
          </View>
        </View>

        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.sub}>Sign in to your school portal</Text>

        {/* Email */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Email address</Text>
          <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.email && styles.inputErr]}
              value={value} onChangeText={onChange}
              placeholder="you@school.edu"
              keyboardType="email-address" autoCapitalize="none"
              placeholderTextColor={NEU.text.muted}
            />
          )} />
          {errors.email && <Text style={styles.err}>{errors.email.message}</Text>}
        </View>

        {/* Password */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Password</Text>
          <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.password && styles.inputErr]}
              value={value} onChangeText={onChange}
              placeholder="••••••••" secureTextEntry
              placeholderTextColor={NEU.text.muted}
            />
          )} />
          {errors.password && <Text style={styles.err}>{errors.password.message}</Text>}
        </View>

        <NeuButton label="Sign In" onPress={handleSubmit(onSubmit)} loading={loading}
          accent="#0EA5E9" style={{ marginTop: 8 }} />

        {/* Demo credentials */}
        <View style={[styles.demo, raiseShadow('sm')]}>
          <Text style={styles.demoTitle}>Demo credentials</Text>
          <Text style={styles.demoLine}>Parent  → parent@demo.com / Demo@123</Text>
          <Text style={styles.demoLine}>Student → student@demo.com / Demo@123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: NEU.surface },
  scroll:  { padding: 24, paddingTop: 60 },
  logoWrap:{ alignItems: 'center', marginBottom: 32 },
  logo:    { width: 90, height: 90, borderRadius: RADIUS.xl, backgroundColor: NEU.surface,
             alignItems: 'center', justifyContent: 'center' },
  logoText:{ fontSize: FONT.xl, fontWeight: '900', color: '#0EA5E9' },
  logoSub: { fontSize: FONT.xs, fontWeight: '700', color: NEU.text.secondary, letterSpacing: 2 },
  heading: { fontSize: FONT.xxl, fontWeight: '800', color: NEU.text.primary, marginBottom: 4 },
  sub:     { fontSize: FONT.md, color: NEU.text.secondary, marginBottom: 28 },
  fieldWrap:{ marginBottom: 16 },
  label:   { fontSize: FONT.sm, fontWeight: '600', color: NEU.text.secondary, marginBottom: 6 },
  input: {
    backgroundColor: NEU.surface, borderRadius: RADIUS.md, padding: 14,
    fontSize: FONT.md, color: NEU.text.primary,
    shadowColor: NEU.shadow, shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5, shadowRadius: 5, elevation: 3,
  },
  inputErr:{ borderWidth: 1.5, borderColor: '#EF4444' },
  err:     { fontSize: FONT.xs, color: '#EF4444', marginTop: 4 },
  demo:    { marginTop: 28, backgroundColor: NEU.surface, borderRadius: RADIUS.md, padding: 14 },
  demoTitle:{ fontSize: FONT.sm, fontWeight: '700', color: NEU.text.secondary, marginBottom: 6 },
  demoLine: { fontSize: FONT.xs, color: NEU.text.muted, marginBottom: 2 },
});
