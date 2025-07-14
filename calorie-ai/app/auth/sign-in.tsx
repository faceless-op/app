import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, useTheme, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const { signIn, loading: authLoading } = useAuth();
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setSnackbarMessage('Please fill in all fields');
      setSnackbarVisible(true);
      return;
    }

    try {
      setLoading(true);
      const { error, session } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      console.log('Sign in successful, session:', session);
      
      // Navigate to the home screen after successful sign-in
      // Using replace to prevent going back to the sign-in screen
      router.replace('/(tabs)/home');
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      setSnackbarMessage(error.message || 'Failed to sign in. Please check your credentials and try again.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignUp = () => {
    router.push('/auth/sign-up');
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoContainer}>
        <View style={[styles.logo, { backgroundColor: theme.colors.primaryContainer }]}>
          <MaterialCommunityIcons 
            name="food-apple" 
            size={60} 
            color={theme.colors.primary} 
          />
        </View>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
          Welcome Back
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Sign in to continue
        </Text>
      </View>

      <View style={styles.formContainer}>
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

        <Button 
          mode="contained" 
          onPress={handleSignIn}
          loading={loading}
          disabled={loading}
          style={styles.signInButton}
          contentStyle={styles.buttonContent}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            Don't have an account?{' '}
          </Text>
          <Text 
            onPress={navigateToSignUp}
            style={[styles.signUpText, { color: theme.colors.primary }]}
          >
            Sign Up
          </Text>
        </View>
      </View>

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
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
  signInButton: {
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
  },
  footerText: {
    fontSize: 14,
  },
  signUpText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default SignInScreen;
