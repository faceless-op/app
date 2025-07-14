import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated, FlatList, TouchableOpacity } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import OnboardingSlide from '../components/OnboardingSlide';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface SlideData {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const slides: SlideData[] = [
  {
    id: '1',
    icon: 'food-apple',
    title: 'Track Your Meals',
    description: 'Easily log your meals by taking a photo or selecting from your gallery.',
  },
  {
    id: '2',
    icon: 'robot',
    title: 'AI-Powered Analysis',
    description: 'Our AI analyzes your meals to track calories and nutrients automatically.',
  },
  {
    id: '3',
    icon: 'chart-line',
    title: 'Monitor Progress',
    description: 'Track your daily nutrition and see your progress over time.',
  },
];

const Paginator = ({ data, scrollX }: { data: SlideData[], scrollX: Animated.Value }) => {
  const theme = useTheme();
  
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });
        
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4],
          extrapolate: 'clamp',
        });
        
        return (
          <Animated.View
            key={i}
            style={[
              styles.paginationDot,
              {
                width: dotWidth,
                opacity,
                backgroundColor: theme.colors.primary,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const theme = useTheme();

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    console.log('scrollTo called, currentIndex:', currentIndex);
    if (currentIndex < slides.length - 1) {
      console.log('Scrolling to next slide');
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      console.log('Last slide, calling handleSkip');
      handleSkip();
    }
  };

  const handleSkip = async () => {
    try {
      console.log('handleSkip called');
      // In a real app, you would save that onboarding is completed here
      // await AsyncStorage.setItem('@onboarding_completed', 'true');
      
      // Navigate to the auth screen
      console.log('Navigating to /auth/sign-in');
      router.replace('/auth/sign-in');
    } catch (error) {
      console.error('Error handling skip:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.carouselContainer}>
        <FlatList
          data={slides}
          renderItem={({ item }) => (
            <OnboardingSlide
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>
      
      <View style={styles.footer}>
        <Paginator data={slides} scrollX={scrollX} />
        
        <View style={styles.buttonsContainer}>
          <Button
            mode="text"
            onPress={handleSkip}
            style={styles.skipButton}
            labelStyle={{ color: theme.colors.onSurface }}
          >
            Skip
          </Button>
          <Button
            mode="contained"
            onPress={scrollTo}
            style={[styles.nextButton, { backgroundColor: theme.colors.primary }]}
            contentStyle={styles.nextButtonContent}
            labelStyle={{ color: theme.colors.onPrimary }}
          >
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    flex: 1,
    width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  skipButton: {
    minWidth: 80,
  },
  nextButton: {
    minWidth: 120,
    borderRadius: 25,
  },
  nextButtonContent: {
    paddingVertical: 8,
  },
});

export default OnboardingScreen;
