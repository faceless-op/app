### Project Overview  
A calorie tracking app that simplifies food logging using AI-powered image recognition. Users capture meal photos, and the app automatically identifies food items, calculates calories/macronutrients, and tracks daily intake. Includes onboarding, subscription paywall, and intuitive daily progress dashboards.  

---  

### **Tech Stack**  
- **Framework**: Expo (React Native)  
- **Language**: TypeScript  
- **Navigation**: Expo Router (file-based)  
- **UI Library**: React Native Paper  
- **Backend/Auth**: Supabase (auth, data storage)  
- **AI**: Deepseek V12 OCR VLM + LLM chat model  
- **Deployment**: Expo Go (development), EAS (production)  

---  

### **Expo Setup**  
- Initialize Expo project with TypeScript template.  
- Configure Supabase SDK for auth and data storage.  
- Set up Expo Router for file-based navigation (onboarding, auth, main app).  
- Integrate React Native Paper for Material Design components.  

---  

### **Authentication Flow**  
1. **Sign-up/Sign-in**: Email/password or social auth via Supabase.  
2. **Paywall**: Subscription gate (Stripe integration) before accessing core features.  
3. **Session Persistence**: Auto-login with Supabase auth state listener.  

---  

### **Features**  

#### **1. Onboarding & Goal Setting**  
- Multi-step form to set health habits (e.g., weight goal, activity level).  
- Input validation with React Hook Form.  

#### **2. Meal Photo Capture**  
- Camera/Gallery integration via `expo-image-picker`.  
- Multi-item support: Single food or composite meal photos.  

#### **3. AI Food Analysis**  
- Send images to Deepseek V12 OCR VLM for item/quantity detection.  
- Use Deepseek LLM to convert OCR data into calories/macronutrients.  

#### **4. Daily Tracking Dashboard**  
- Summary of calories/macros per meal + remaining daily budget.  
- Progress charts (React Native SVG).  

#### **5. Meal History & Editing**  
- Scrollable list of past meals (Supabase storage).  
- Swipe-to-delete/edit gestures.  

#### **6. Offline Support**  
- Cache meal data locally (Supabase offline-first policies).  
- Sync when back online.  

---  

### **Mobile Considerations**  
- **Navigation**: Tab-based (Expo Router) for main features.  
- **Gestures**: Swipe actions for meal history.  
- **Performance**: Optimize image uploads (compression with `expo-image-manipulator`).  

---  

Let me know if you'd like adjustments to the structure or additional features!