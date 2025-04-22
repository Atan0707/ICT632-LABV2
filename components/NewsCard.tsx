import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

export type Article = {
  title: string;
  description: string;
  urlToImage: string;
  source: {
    name: string;
  };
  publishedAt: string;
  url: string;
};

export function NewsCard({ article, onPress }: { article: Article; onPress: () => void }) {
  const cardBackground = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'icon');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <ThemedView style={[styles.card, { borderColor }]}>
        {article.urlToImage ? (
          <Image 
            source={{ uri: article.urlToImage }} 
            style={styles.image} 
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]} />
        )}
        
        <View style={styles.contentContainer}>
          <ThemedText type="subtitle" numberOfLines={2} style={styles.title}>
            {article.title}
          </ThemedText>
          
          <ThemedText numberOfLines={3} style={styles.description}>
            {article.description}
          </ThemedText>
          
          <View style={styles.footer}>
            <ThemedText style={styles.source}>
              {article.source.name}
            </ThemedText>
            <ThemedText style={styles.date}>
              {formatDate(article.publishedAt)}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
  },
  placeholderImage: {
    backgroundColor: '#e0e0e0',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  source: {
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    opacity: 0.7,
  }
}); 