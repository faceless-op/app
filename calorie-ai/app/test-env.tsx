import { View, Text } from 'react-native';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

export default function EnvTest() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Supabase URL: {SUPABASE_URL ? '✅ Loaded' : '❌ Not loaded'}</Text>
      <Text>Supabase Key: {SUPABASE_ANON_KEY ? '✅ Loaded' : '❌ Not loaded'}</Text>
    </View>
  );
}
