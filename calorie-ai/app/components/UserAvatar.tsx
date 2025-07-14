import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface UserAvatarProps {
  size?: number;
  name?: string;
  imageUri?: string | null;
  style?: any;
}

const UserAvatar = ({ 
  size = 100, 
  name = 'User',
  imageUri,
  style 
}: UserAvatarProps) => {
  const theme = useTheme();
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  if (imageUri) {
    return (
      <View style={[styles.avatarContainer, { width: size, height: size }, style]}>
        <Avatar.Image 
          size={size} 
          source={{ uri: imageUri }} 
          style={styles.avatar}
        />
      </View>
    );
  }

  return (
    <View style={[styles.avatarContainer, { width: size, height: size }, style]}>
      <View 
        style={[
          styles.initialsContainer, 
          { 
            backgroundColor: theme.colors.primaryContainer,
            width: size,
            height: size,
            borderRadius: size / 2
          }
        ]}
      >
        <Text 
          style={[
            styles.initialsText, 
            { 
              color: theme.colors.onPrimaryContainer,
              fontSize: size * 0.4
            }
          ]}
        >
          {initials}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 2,
    borderColor: 'white',
  },
  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  initialsText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default UserAvatar;
