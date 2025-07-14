import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function EditProfileScreen() {
  const theme = useTheme();
  const { user, refreshSession } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name || user?.email?.split('@')[0] || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name }
      });

      if (error) throw error;
      
      // Refresh session to get updated user data
      await refreshSession();
      
      // Go back to profile
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        label="Display Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
      />
      
      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Save Changes
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});
