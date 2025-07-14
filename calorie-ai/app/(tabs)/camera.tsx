import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Camera, CameraType, FlashMode, useCameraPermissions, CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Button, useTheme, Modal, Portal, PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { saveMeal } from '../../services/mealService';
import { detectFood } from '../../services/visionService';

type FoodInfo = {
  food: {
    label: string;
    nutrients: {
      ENERC_KCAL: number;
      PROCNT: number;
      FAT: number;
      CHOCDF: number;
    };
  };
};

const FoodCameraScreen = () => {
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [foodData, setFoodData] = useState<FoodInfo | null>(null);
  const [showResult, setShowResult] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsAnalyzing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
          exif: false
        });
        
        if (photo.uri) {
          setCapturedImage(photo.uri);
          await analyzeFood(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        setIsAnalyzing(false);
      }
    }
  };

  const analyzeFood = async (imageUri: string) => {
    try {
      const result = await detectFood(imageUri);
      setFoodData(result);
      setShowResult(true);
    } catch (error) {
      console.error('Error analyzing food:', error);
      alert('Failed to analyze the food. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveMeal = async () => {
    if (!foodData) return;

    try {
      // Get current user ID - you'll need to implement this based on your auth system
      const userId = 'current-user-id';
      
      await saveMeal({
        user_id: userId,
        name: foodData.food.label,
        calories: foodData.food.nutrients.ENERC_KCAL,
        protein: foodData.food.nutrients.PROCNT,
        carbs: foodData.food.nutrients.CHOCDF,
        fat: foodData.food.nutrients.FAT,
        // created_at will be set by the database
      });
      
      // Reset the camera after saving
      setShowResult(false);
      setFoodData(null);
      setCapturedImage(null);
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  };

  const handleCancel = () => {
    setShowResult(false);
    setFoodData(null);
    setCapturedImage(null);
    setIsAnalyzing(false);
  };

  const pickImage = async () => {
    try {
      setIsAnalyzing(true);
      // Request permission to access the media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to select an image!');
        return;
      }

      // Launch the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setCapturedImage(selectedImage.uri);
        await analyzeFood(selectedImage.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Error selecting image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!permission) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text>We need your permission to use the camera</Text>
        <Button onPress={requestPermission} mode="contained" style={styles.permissionButton}>
          Grant Permission
        </Button>
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={cameraType}
          flash={flashMode}
        >
          <View style={styles.buttonContainer}>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={pickImage}
                disabled={isAnalyzing}
              >
                <Ionicons name="images" size={32} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.captureButton, { backgroundColor: theme.colors.primary }]}
                onPress={takePicture}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Ionicons name="camera" size={32} color="white" />
                )}
              </TouchableOpacity>
              
              <View style={styles.iconButton} />
            </View>
          </View>
        </CameraView>

        <Portal>
          <Modal
            visible={showResult && !!foodData}
            onDismiss={handleCancel}
            contentContainerStyle={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <Text style={styles.foodName}>{foodData?.food.label}</Text>
              
              <View style={styles.nutritionContainer}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{foodData?.food.nutrients.ENERC_KCAL}</Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{foodData?.food.nutrients.PROCNT}g</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{foodData?.food.nutrients.CHOCDF}g</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{foodData?.food.nutrients.FAT}g</Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
              </View>

              <View style={styles.buttonRow}>
                <Button
                  mode="outlined"
                  onPress={handleCancel}
                  style={[styles.button, { marginRight: 10 }]}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSaveMeal}
                  style={styles.button}
                >
                  Save Meal
                </Button>
              </View>
            </View>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

export default FoodCameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionButton: {
    marginTop: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalContent: {
    padding: 10,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    flex: 1,
  },
});
