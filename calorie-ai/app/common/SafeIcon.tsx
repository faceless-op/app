import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type SafeIconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: object;
};

/**
 * A safe wrapper for icons that handles missing icon cases gracefully.
 * Replace this with actual icon components from your preferred icon library.
 */
const SafeIcon: React.FC<SafeIconProps> = ({
  name,
  size = 24,
  color = 'black',
  style,
}) => {
  // This is a fallback component. In a real app, you would import and use an actual icon component here.
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.iconText, { fontSize: size, color }]}>{name.charAt(0)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontWeight: 'bold',
  },
});

export default SafeIcon;
