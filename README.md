# Calorie AI

An AI-powered calorie tracking app that simplifies food logging using image recognition.

## 🚀 Features

- AI-powered food recognition from chat bot.
- Daily calorie and macronutrient tracking
- Intuitive progress dashboards
- Secure authentication with Supabase
- Cross-platform (iOS, Android, Web)

## 🛠 Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based)
- **UI Library**: React Native Paper
- **Backend/Auth**: Supabase
- **AI**: Deepseek V12 OCR VLM + LLM chat model

## 🚀 Getting Started

1. **Clone the repository**
   ```sh
   git clone <repository-url>
   cd calorie-ai
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the development server**
   ```sh
   npm start
   ```

## 📱 Running the App

- **iOS Simulator**: Press `i` in the terminal after starting the dev server
- **Android Emulator**: Press `a` in the terminal after starting the dev server
- **Web**: Press `w` in the terminal after starting the dev server
- **Expo Go**: Scan the QR code with your mobile device

## 📂 Project Structure

```
app/
  ├── auth/              # Authentication screens
  ├── onboarding/        # Onboarding flow
  ├── home/              # Main app screens
  ├── components/        # Reusable components
  └── utils/             # Utility functions
```

## 📝 Notes

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)
- [Supabase Documentation](https://supabase.com/docs)
