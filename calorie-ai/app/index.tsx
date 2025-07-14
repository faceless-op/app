import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    console.log('Navigating to onboarding');
    router.push('/(onboarding)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Calorie AI</Text>
      <Text style={styles.subtitle}>Track your nutrition with AI</Text>
      <Button 
        mode="contained" 
        onPress={handleGetStarted}
        style={styles.button}
      >
        Get Started
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 300,
    marginTop: 20,
  },
});
