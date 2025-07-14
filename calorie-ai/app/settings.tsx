import { useEffect, useState } from 'react';
import { View, StyleSheet, Switch, Linking } from 'react-native';
import { useTheme, List, Menu, Divider, Button } from 'react-native-paper';
import { usePreferences } from '../hooks/usePreferences';
import { useLanguage, LanguageCode } from '../hooks/useLanguage';
import { APP_INFO } from '../constants/appInfo';

const handleLinkPress = async (url: string) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error(`Cannot open URL: ${url}`);
    }
  } catch (error) {
    console.error('Error opening URL:', error);
  }
};

export default function SettingsScreen() {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = usePreferences();
  const { language, changeLanguage, supportedLanguages, isLoading } = useLanguage();
  const [visible, setVisible] = useState(false);
  
  const currentLanguage = supportedLanguages.find(lang => lang.code === language) || supportedLanguages[0];

  // Force re-render when theme changes
  useEffect(() => {
    // This empty effect forces re-render when theme changes
  }, [theme]);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader style={{ color: theme.colors.onSurface }}>Appearance</List.Subheader>
        <List.Item
          title="Dark Mode"
          titleStyle={{ color: theme.colors.onSurface }}
          right={() => (
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleTheme}
              thumbColor={theme.colors.primary}
              trackColor={{ 
                true: theme.colors.primaryContainer,
                false: theme.colors.surfaceVariant
              }}
            />
          )}
        />
        
        <Divider style={{ marginVertical: 8 }} />
        
        <List.Subheader style={{ color: theme.colors.onSurface }}>Language</List.Subheader>
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <List.Item
              title="App Language"
              description={currentLanguage.name}
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              onPress={() => setVisible(true)}
              right={props => <List.Icon {...props} icon="chevron-down" />}
            />
          }
          contentStyle={{ backgroundColor: theme.colors.surface }}
        >
          {supportedLanguages.map((lang) => (
            <Menu.Item
              key={lang.code}
              title={lang.name}
              titleStyle={{ 
                color: language === lang.code 
                  ? theme.colors.primary 
                  : theme.colors.onSurface
              }}
              onPress={() => {
                changeLanguage(lang.code as LanguageCode);
                setVisible(false);
              }}
            />
          ))}
        </Menu>
        
        <Divider style={{ marginVertical: 8 }} />

        <List.Subheader style={{ color: theme.colors.onSurface }}>About</List.Subheader>
        <List.Item
          title="App Version"
          description={APP_INFO.version}
          titleStyle={{ color: theme.colors.onSurface }}
          descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          left={props => <List.Icon {...props} icon="information" />}
        />
        <List.Item
          title="Terms of Use"
          titleStyle={{ color: theme.colors.onSurface }}
          onPress={() => handleLinkPress(APP_INFO.termsUrl)}
          left={props => <List.Icon {...props} icon="file-document" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="Privacy Policy"
          titleStyle={{ color: theme.colors.onSurface }}
          onPress={() => handleLinkPress(APP_INFO.privacyUrl)}
          left={props => <List.Icon {...props} icon="shield-lock" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="Developer Info"
          titleStyle={{ color: theme.colors.onSurface }}
          onPress={() => handleLinkPress(APP_INFO.developerUrl)}
          left={props => <List.Icon {...props} icon="code-tags" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="About Us"
          titleStyle={{ color: theme.colors.onSurface }}
          onPress={() => handleLinkPress(APP_INFO.aboutUsUrl)}
          left={props => <List.Icon {...props} icon="account-group" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  }
});
