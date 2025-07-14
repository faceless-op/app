import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, useTheme, SegmentedButtons, Card, Button } from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProgressScreen = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState('nutrition');

  // Mock data - replace with actual data from your state management
  const nutritionData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [1800, 2000, 1900, 2100, 1950, 2200, 1850],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      },
      {
        data: [2000, 2000, 2000, 2000, 2000, 2000, 2000],
        color: (opacity = 0.2) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 1,
        withDots: false
      }
    ],
    legend: ['Calories Consumed', 'Daily Goal']
  };

  const macroData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [120, 220, 65],
        colors: [
          (opacity = 1) => '#4CAF50',
          (opacity = 1) => '#2196F3',
          (opacity = 1) => '#FF9800',
        ]
      }
    ]
  };

  const weightData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [75, 74, 73, 72, 71, 70],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  const renderNutritionTab = () => (
    <View style={styles.tabContent}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Weekly Calorie Intake
          </Text>
          <LineChart
            data={nutritionData}
            width={Dimensions.get('window').width - 48}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(${theme.colors.onSurface}, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(${theme.colors.onSurface}, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: theme.colors.primary
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Macronutrient Distribution
          </Text>
          <BarChart
            data={{
              labels: macroData.labels,
              datasets: macroData.datasets,
            }}
            width={Dimensions.get('window').width - 48}
            height={220}
            yAxisLabel=""
            yAxisSuffix="g"
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(${theme.colors.onSurface}, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(${theme.colors.onSurface}, ${opacity})`,
              style: {
                borderRadius: 16
              },
              barPercentage: 0.5,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
              <Text style={[styles.legendText, { color: theme.colors.onSurface }]}>Protein</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
              <Text style={[styles.legendText, { color: theme.colors.onSurface }]}>Carbs</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
              <Text style={[styles.legendText, { color: theme.colors.onSurface }]}>Fat</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderFitnessTab = () => (
    <View style={styles.tabContent}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Weight Trend
          </Text>
          <LineChart
            data={weightData}
            width={Dimensions.get('window').width - 48}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(${theme.colors.onSurface}, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(${theme.colors.onSurface}, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: theme.colors.primary
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Weekly Activity
          </Text>
          <View style={styles.activityContainer}>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <View key={day} style={styles.activityDay}>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'][day - 1]}
                </Text>
                <View 
                  style={[
                    styles.activityBar, 
                    { 
                      height: Math.random() * 80 + 20,
                      backgroundColor: theme.colors.primary,
                      opacity: 0.7
                    }
                  ]} 
                />
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.tabContent}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Your Achievements
          </Text>
          <View style={styles.achievementsGrid}>
            {[
              { icon: 'trophy-outline' as const, label: '5 Day Streak', color: '#FFD700' },
              { icon: 'food-apple-outline' as const, label: 'Healthy Eater', color: '#4CAF50' },
              { icon: 'run' as const, label: 'Active Week', color: '#2196F3' },
              { icon: 'scale-bathroom' as const, label: 'Goal Weight', color: '#9C27B0' },
              { icon: 'water-outline' as const, label: 'Hydration Master', color: '#00BCD4' },
              { icon: 'medal-outline' as const, label: 'Perfect Week', color: '#FF9800' },
            ].map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <View 
                  style={[
                    styles.achievementIcon, 
                    { backgroundColor: `${achievement.color}20` }
                  ]}
                >
                  <MaterialCommunityIcons 
                    name={achievement.icon} 
                    size={24} 
                    color={achievement.color} 
                  />
                </View>
                <Text 
                  variant="labelSmall" 
                  style={[
                    styles.achievementLabel, 
                    { color: theme.colors.onSurfaceVariant }
                  ]}
                >
                  {achievement.label}
                </Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
          Your Progress
        </Text>
        <SegmentedButtons
          value={timeRange}
          onValueChange={setTimeRange}
          buttons={[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <View style={styles.tabsContainer}>
        <Button
          mode={activeTab === 'nutrition' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('nutrition')}
          style={styles.tabButton}
          contentStyle={styles.tabButtonContent}
        >
          Nutrition
        </Button>
        <Button
          mode={activeTab === 'fitness' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('fitness')}
          style={styles.tabButton}
          contentStyle={styles.tabButtonContent}
        >
          Fitness
        </Button>
        <Button
          mode={activeTab === 'achievements' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('achievements')}
          style={styles.tabButton}
          contentStyle={styles.tabButtonContent}
        >
          Achievements
        </Button>
      </View>

      {activeTab === 'nutrition' && renderNutritionTab()}
      {activeTab === 'fitness' && renderFitnessTab()}
      {activeTab === 'achievements' && renderAchievements()}

      <View style={styles.statsContainer}>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.statCardContent}>
            <MaterialCommunityIcons 
              name="fire" 
              size={24} 
              color={theme.colors.primary} 
              style={styles.statIcon}
            />
            <View>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Calories Burned
              </Text>
              <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                2,450
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}> / 3,000</Text>
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.statCardContent}>
            <MaterialCommunityIcons 
              name="shoe-print" 
              size={24} 
              color={theme.colors.primary} 
              style={styles.statIcon}
            />
            <View>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Steps Today
              </Text>
              <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                8,763
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}> / 10,000</Text>
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  segmentedButtons: {
    maxWidth: 250,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  tabButtonContent: {
    height: 40,
  },
  tabContent: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
  activityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: 16,
  },
  activityDay: {
    alignItems: 'center',
    flex: 1,
  },
  activityBar: {
    width: 20,
    backgroundColor: '#6200ee',
    borderRadius: 4,
    marginTop: 8,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementLabel: {
    textAlign: 'center',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  statCardContent: {
    padding: 12,
  },
  statIcon: {
    marginRight: 12,
  },
});

export default ProgressScreen;
