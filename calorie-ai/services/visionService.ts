import { GOOGLE_CLOUD_VISION_API_KEY } from '@env';

if (!GOOGLE_CLOUD_VISION_API_KEY) {
  throw new Error('Google Cloud Vision API key not found. Please check your .env file');
}

console.log('Google Cloud Vision API Key loaded:', GOOGLE_CLOUD_VISION_API_KEY ? 'Yes' : 'No');

// Mock food detection service
const FOOD_ITEMS = [
  { label: 'Pizza', calories: 285, protein: 12, fat: 10, carbs: 36 },
  { label: 'Salad', calories: 150, protein: 5, fat: 8, carbs: 12 },
  { label: 'Burger', calories: 354, protein: 16, fat: 17, carbs: 31 },
  { label: 'Pasta', calories: 131, protein: 5, fat: 1, carbs: 25 },
];

export const detectFood = async (imageUri: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return random food item
  const randomFood = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)];

  return {
    food: {
      label: randomFood.label,
      nutrients: {
        ENERC_KCAL: randomFood.calories,
        PROCNT: randomFood.protein,
        FAT: randomFood.fat,
        CHOCDF: randomFood.carbs
      }
    }
  };
};
