import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, Modal } from 'react-native';
import { Text, useTheme, Button, ActivityIndicator, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import UserAvatar from '../components/UserAvatar';
import { useAuth } from '../../hooks/useAuth';
import { useAvatar } from '../../contexts/AvatarContext';
import { useUser } from '../../contexts/UserContext';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase'; // Import supabase instance
import { StackNavigationProp } from '@react-navigation/stack';

interface UserStats {
  streak: number;
  mealsTracked: number;
  weightLost: number;
}

interface UserData {
  name: string;
  email: string;
  joinDate: string;
  stats: UserStats;
  subscription: string;
  gender?: string;
  dob?: string;
  height?: number;
  weight?: number;
  phone?: string;
  address?: string;
  recoveryEmail?: string;
}

type ProfileStackParamList = {
  settings: undefined;
  // Add other routes here if needed
};

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList>;

const ProfileScreen = () => {

  const theme = useTheme();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, signOut, loading: authLoading } = useAuth();
  const { avatarUri, setAvatarUri } = useAvatar();
  const { userData, updateUserData } = useUser();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserData>>({});

  // Initialize edit form when userData changes
  useEffect(() => {
    if (userData) {
      setEditForm({
        name: userData.name,
        gender: userData.gender,
        dob: userData.dob,
        height: userData.height,
        weight: userData.weight,
        phone: userData.phone,
        address: userData.address,
        recoveryEmail: userData.recoveryEmail
      });
      setLoading(false);
    }
  }, [userData]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await updateUserData(editForm);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (field: keyof UserData, value: string | number) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Show loading indicator while loading
  if (loading || authLoading || !userData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          Profile
        </Text>
        <View style={styles.avatarContainer}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <UserAvatar size={120} name={userData.name} />
          )}
          <Button mode="outlined" onPress={pickImage} style={styles.uploadButton}>
            Change Photo
          </Button>
          <Text variant="headlineSmall" style={[styles.userName, { color: theme.colors.onSurface }]}>
            {userData.name}
          </Text>
          <Text variant="bodyMedium" style={[styles.userEmail, { color: theme.colors.onSurfaceVariant }]}>
            {userData.email}
          </Text>
          <Text variant="bodySmall" style={[styles.joinDate, { color: theme.colors.onSurfaceVariant }]}>
            {userData.joinDate}
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
              {userData.stats.streak}
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
              {userData.stats.mealsTracked}
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Meals Tracked</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
              {userData.stats.weightLost}kg
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Lost</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Button 
          mode="contained" 
          onPress={() => {
            setIsEditing(true);
          }}
          style={styles.editButton}
        >
          Edit Profile
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('settings')}
          style={[styles.button, { marginTop: 12 }]}
          icon="cog"
        >
          Settings
        </Button>

        <Button
          mode="outlined"
          onPress={() => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Sign Out',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await signOut();
                      // Navigation is handled by the auth guard in _layout.tsx
                    } catch (error) {
                      console.error('Error signing out:', error);
                      Alert.alert('Error', 'Failed to sign out. Please try again.');
                    }
                  },
                },
              ],
              { cancelable: true }
            );
          }}
          style={[styles.button, { marginTop: 24, borderColor: theme.colors.error }]}
          textColor={theme.colors.error}
          icon="logout"
        >
          Sign Out
        </Button>
      </View>

      <Modal visible={isEditing} onDismiss={() => setIsEditing(false)}>
        <View style={styles.modalContainer}>
          <Text variant="headlineSmall" style={styles.modalTitle}>Edit Profile</Text>
          
          <TextInput
            label="Full Name"
            value={editForm.name || ''}
            onChangeText={(text) => handleEditChange('name', text)}
            style={styles.input}
          />
          
          <TextInput
            label="Gender"
            value={editForm.gender || ''}
            onChangeText={(text) => handleEditChange('gender', text)}
            style={styles.input}
          />
          
          <TextInput
            label="Date of Birth"
            value={editForm.dob || ''}
            onChangeText={(text) => handleEditChange('dob', text)}
            style={styles.input}
          />
          
          <TextInput
            label="Height (cm)"
            value={editForm.height?.toString() || ''}
            onChangeText={(text) => handleEditChange('height', Number(text))}
            keyboardType="numeric"
            style={styles.input}
          />
          
          <TextInput
            label="Weight (kg)"
            value={editForm.weight?.toString() || ''}
            onChangeText={(text) => handleEditChange('weight', Number(text))}
            keyboardType="numeric"
            style={styles.input}
          />
          
          <TextInput
            label="Phone Number"
            value={editForm.phone || ''}
            onChangeText={(text) => handleEditChange('phone', text)}
            keyboardType="phone-pad"
            style={styles.input}
          />
          
          <TextInput
            label="Address"
            value={editForm.address || ''}
            onChangeText={(text) => handleEditChange('address', text)}
            multiline
            style={styles.input}
          />
          
          <TextInput
            label="Recovery Email"
            value={editForm.recoveryEmail || ''}
            onChangeText={(text) => handleEditChange('recoveryEmail', text)}
            keyboardType="email-address"
            style={styles.input}
          />
          
          <View style={styles.modalButtons}>
            <Button mode="outlined" onPress={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button mode="contained" onPress={handleSaveProfile}>
              Save
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  uploadButton: {
    marginTop: 10,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    marginBottom: 4,
  },
  joinDate: {
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  section: {
    marginTop: 16,
  },
  button: {
    width: '100%',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    marginTop: 20,
  }
});

export default ProfileScreen;