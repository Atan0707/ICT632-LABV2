import { View, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Linking, Text } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Article } from './NewsCard';
import { Ionicons } from '@expo/vector-icons';

export function NewsDetail({ article, onClose }: { article: Article; onClose: () => void }) {
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openArticleLink = async () => {
    if (await Linking.canOpenURL(article.url)) {
      await Linking.openURL(article.url);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.closeButton,
          { 
            backgroundColor: 'rgba(0,0,0,0.7)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 5,
          }
        ]} 
        onPress={onClose}
      >
        <Ionicons name="close" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      {article.urlToImage ? (
        <Image 
          source={{ uri: article.urlToImage }} 
          style={styles.image} 
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]} />
      )}
      
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="title" style={styles.title}>
          {article.title}
        </ThemedText>
        
        <View style={styles.sourceContainer}>
          <ThemedText style={styles.source}>{article.source.name}</ThemedText>
          <ThemedText style={styles.date}>{formatDate(article.publishedAt)}</ThemedText>
        </View>
        
        <ThemedText style={styles.description}>
          {article.description}
        </ThemedText>
        
        <TouchableOpacity 
          style={[
            styles.readMoreButton, 
            { backgroundColor: '#0a7ea4' }
          ]} 
          onPress={openArticleLink}
        >
          <Text style={[styles.readMoreText, { color: '#FFFFFF' }]}>
            Read Full Article
          </Text>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width,
    height: height * 0.4,
  },
  placeholderImage: {
    backgroundColor: '#e0e0e0',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    marginBottom: 12,
  },
  sourceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  source: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    opacity: 0.7,
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 24,
  },
  readMoreButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  readMoreText: {
    fontSize: 16,
    fontWeight: '600',
  }
}); 