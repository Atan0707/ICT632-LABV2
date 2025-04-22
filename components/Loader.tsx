import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

type LoaderProps = {
  message?: string;
  isFullScreen?: boolean;
};

export function Loader({ message = 'Loading...', isFullScreen = false }: LoaderProps) {
  const tintColor = useThemeColor({}, 'tint');
  
  return (
    <View style={[styles.container, isFullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={tintColor} />
      {message && <ThemedText style={styles.text}>{message}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fullScreen: {
    flex: 1,
  },
  text: {
    marginTop: 12,
    textAlign: 'center',
  },
}); 