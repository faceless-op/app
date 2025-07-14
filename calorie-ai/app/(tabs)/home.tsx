import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Card, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import UserAvatar from '../components/UserAvatar';
import { useAuth } from '../../hooks/useAuth';
import { useAvatar } from '../../contexts/AvatarContext';
import { useUser } from '../../contexts/UserContext';
import { useAppLanguage } from '../../contexts/LanguageContext';

const HomeScreen = () => {
  const theme = useTheme();
  const { user, refreshSession } = useAuth();
  const { avatarUri } = useAvatar();
  const { userData } = useUser();
  const { language } = useAppLanguage();
  
  console.log('User data:', user); // Debug logging
  console.log('User metadata:', user?.user_metadata); // Debug logging

  // Get display name with multiple fallbacks
  const getDisplayName = () => {
    return userData?.name || 'User';
  };

  const [displayName, setDisplayName] = useState(getDisplayName());
  
  useEffect(() => {
    setDisplayName(getDisplayName());
  }, [userData]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Mock data - replace with actual data from your state management
  const dailyStats = {
    calories: {
      consumed: 1250,
      goal: 2000,
      remaining: 750,
    },
    macros: {
      protein: { current: 85, goal: 150, unit: 'g' },
      carbs: { current: 150, goal: 250, unit: 'g' },
      fat: { current: 45, goal: 65, unit: 'g' },
    },
    water: {
      current: 4,
      goal: 8,
      unit: 'glasses',
    },
  };

  const greetings: Record<string, string> = {
    en: 'Hello',
    es: 'Hola',
    fr: 'Bonjour',
    de: 'Hallo',
    zh: '你好'
  };

  const MacroProgress = ({ label, current, goal, unit, color }: any) => {
    const percentage = Math.min(100, (current / goal) * 100);
    
    return (
      <View style={styles.macroItem}>
        <View style={styles.macroHeader}>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {label}
          </Text>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurface }}>
            {current}/{goal} {unit}
          </Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: `${color}20` }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${percentage}%`,
                backgroundColor: color,
              }
            ]} 
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <UserAvatar size={60} name={getDisplayName()} />
            )}
            <Text variant="titleLarge" style={styles.greeting}>
              {greetings[language as string] || greetings.en}, {displayName}!
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
            {today}
          </Text>
        </View>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                Today's Calories
              </Text>
              <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                {dailyStats.calories.consumed} / {dailyStats.calories.goal}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
                {dailyStats.calories.remaining} remaining
              </Text>
            </View>
            
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    backgroundColor: `${theme.colors.primary}20`,
                    height: 16,
                    borderRadius: 8,
                  }
                ]}
              >
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${(dailyStats.calories.consumed / dailyStats.calories.goal) * 100}%`,
                      backgroundColor: theme.colors.primary,
                      borderRadius: 8,
                    }
                  ]} 
                />
              </View>
            </View>

            <View style={styles.macrosContainer}>
              <MacroProgress 
                label="Protein" 
                current={dailyStats.macros.protein.current} 
                goal={dailyStats.macros.protein.goal} 
                unit="g"
                color="#4CAF50"
              />
              <MacroProgress 
                label="Carbs" 
                current={dailyStats.macros.carbs.current} 
                goal={dailyStats.macros.carbs.goal} 
                unit="g"
                color="#2196F3"
              />
              <MacroProgress 
                label="Fat" 
                current={dailyStats.macros.fat.current} 
                goal={dailyStats.macros.fat.goal} 
                unit="g"
                color="#FF9800"
              />
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Water Intake
            </Text>
            <View style={styles.waterContainer}>
              {[...Array(8)].map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.waterCup,
                    { 
                      backgroundColor: index < dailyStats.water.current 
                        ? theme.colors.primary 
                        : `${theme.colors.primary}20`,
                      borderColor: theme.colors.outline,
                    }
                  ]}
                >
                  <Ionicons 
                    name="water" 
                    size={20} 
                    color={index < dailyStats.water.current 
                      ? theme.colors.onPrimary 
                      : theme.colors.onSurfaceVariant
                    } 
                  />
                </View>
              ))}
            </View>
            <Text style={{ color: theme.colors.primary, textAlign: 'center', marginTop: 8 }}>
              {dailyStats.water.current} / {dailyStats.water.goal} {dailyStats.water.unit}
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={[styles.cardHeader, { marginBottom: 12 }]}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                Recent Meals
              </Text>
              <Button 
                mode="text" 
                onPress={() => router.push('/(tabs)/meals')}
                labelStyle={{ fontSize: 12 }}
                compact
              >
                View All
              </Button>
            </View>
            
            <View style={styles.recentMeal}>
              <View style={styles.mealIcon}>
                <Ionicons name="fast-food" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.mealInfo}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  Breakfast
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  450 cal • 8:30 AM
                </Text>
              </View>
              <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                450
              </Text>
            </View>
            
            <View style={styles.recentMeal}>
              <View style={styles.mealIcon}>
                <Ionicons name="pizza" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.mealInfo}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  Lunch
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  800 cal • 12:45 PM
                </Text>
              </View>
              <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                800
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  greeting: {
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressContainer: {
    marginVertical: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  macrosContainer: {
    marginTop: 16,
  },
  macroItem: {
    marginBottom: 12,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  actionButtonContent: {
    height: 48,
  },
  waterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  waterCup: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentMeal: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  mealIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
});
