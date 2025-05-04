import { Image, StyleSheet, Platform, Modal, FlatList, RefreshControl, View } from 'react-native';
import { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NewsCard, Article } from '@/components/NewsCard';
import { NewsDetail } from '@/components/NewsDetail';
import { Loader } from '@/components/Loader';

export default function HomeScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const fetchNews = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    
    setError(null);
    
    try {
      const response = await fetch(
        'http://192.168.1.170:3000/api/news'
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'ok' && data.articles) {
        const validArticles = data.articles.filter(
          (article: any) => article.title && article.description
        );
        
        if (validArticles.length === 0) {
          throw new Error('No valid articles found');
        }
        
        setArticles(validArticles);
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Failed to load news: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleRefresh = () => {
    fetchNews(true);
  };

  const renderNewsItem = ({ item }: { item: Article }) => (
    <NewsCard 
      article={item} 
      onPress={() => setSelectedArticle(item)} 
    />
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Malaysia News</ThemedText>
      </View>
      
      {/* Content */}
      {loading ? (
        <Loader message="Loading headlines..." isFullScreen />
      ) : error ? (
        <View style={styles.centered}>
          <ThemedText type="subtitle" style={styles.errorText}>{error}</ThemedText>
        </View>
      ) : (
        <FlatList
          data={articles}
          renderItem={renderNewsItem}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[tintColor]}
              tintColor={tintColor}
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <ThemedText type="subtitle">No news available</ThemedText>
            </View>
          }
        />
      )}
      
      {/* Article Detail Modal */}
      <Modal
        visible={selectedArticle !== null}
        animationType="slide"
        onRequestClose={() => setSelectedArticle(null)}
      >
        {selectedArticle && (
          <NewsDetail 
            article={selectedArticle} 
            onClose={() => setSelectedArticle(null)} 
          />
        )}
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  list: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
