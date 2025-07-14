import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface OnboardingSlideProps {
  icon: string;
  title: string;
  description: string;
}

const { width, height } = Dimensions.get('window');

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  icon,
  title,
  description,
}) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.slide, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
        <MaterialCommunityIcons 
          name={icon as any} 
          size={120} 
          color={theme.colors.primary} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>{title}</Text>
        <Text style={[styles.description, { color: theme.colors.onSurface }]}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    width,
    height,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  textContainer: {
    flex: 0.4,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default OnboardingSlide;
