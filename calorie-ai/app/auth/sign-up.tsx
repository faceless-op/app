import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, Button, Text, useTheme, Snackbar, Checkbox } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const theme = useTheme();
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !fullName) {
      setSnackbarMessage('Please fill in all fields');
      return false;
    }
    
    if (password !== confirmPassword) {
      setSnackbarMessage('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setSnackbarMessage('Password must be at least 6 characters');
      return false;
    }
    
    if (!termsAccepted) {
      setSnackbarMessage('You must accept the terms and conditions');
      return false;
    }
    
    return true;
  };

  const { signUp, loading: authLoading } = useAuth();

  const handleSignUp = async () => {
    if (!validateForm()) {
      setSnackbarVisible(true);
      return;
    }

    try {
      setLoading(true);
      const { error } = await signUp(email, password, { fullName });
      
      if (error) throw error;
      
      // Show success message
      Alert.alert(
        'Verify Your Email',
        'A verification email has been sent. Please check your inbox and verify your email address before signing in.'
      );
      
      // Navigate to sign-in after successful sign-up
      router.replace('/auth/sign-in');
    } catch (error: any) {
      console.error('Sign up error:', error);
      setSnackbarMessage(error.message || 'Failed to create account. Please try again.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignIn = () => {
    router.push('/auth/sign-in');
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={[styles.logo, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons 
              name="food-apple" 
              size={60} 
              color={theme.colors.primary} 
            />
          </View>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Fill in your details to get started
          </Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon 
                icon={showPassword ? 'eye-off' : 'eye'} 
                onPress={togglePasswordVisibility}
                forceTextInputFocus={false}
              />
            }
          />
          
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="lock-check" />}
            right={
              <TextInput.Icon 
                icon={showConfirmPassword ? 'eye-off' : 'eye'} 
                onPress={toggleConfirmPasswordVisibility}
                forceTextInputFocus={false}
              />
            }
          />

          <View style={styles.termsContainer}>
            <Checkbox.Android
              status={termsAccepted ? 'checked' : 'unchecked'}
              onPress={() => setTermsAccepted(!termsAccepted)}
              color={theme.colors.primary}
            />
            <Text style={[styles.termsText, { color: theme.colors.onSurfaceVariant }]}>
              I agree to the{' '}
              <Text style={{ color: theme.colors.primary }} onPress={() => {}}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text style={{ color: theme.colors.primary }} onPress={() => {}}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          <Button 
            mode="contained" 
            onPress={handleSignUp}
            loading={loading}
            disabled={loading}
            style={styles.signUpButton}
            contentStyle={styles.buttonContent}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
              Already have an account?{' '}
            </Text>
            <Text 
              onPress={navigateToSignIn}
              style={[styles.signInText, { color: theme.colors.primary }]}
            >
              Sign In
            </Text>
          </View>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.errorContainer }}
      >
        <Text style={{ color: theme.colors.onErrorContainer }}>{snackbarMessage}</Text>
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  termsText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    lineHeight: 18,
  },
  signUpButton: {
    marginTop: 8,
    paddingVertical: 6,
  },
  buttonContent: {
    height: 48,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
  },
  signInText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default SignUpScreen;
