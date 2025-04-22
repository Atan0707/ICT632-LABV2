import { StyleSheet, Image, Platform, TouchableOpacity, View, TextInput, FlatList, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NewsCard, Article } from '@/components/NewsCard';
import { NewsDetail } from '@/components/NewsDetail';
import { Loader } from '@/components/Loader';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: 'business', name: 'Business', icon: 'briefcase' },
  { id: 'entertainment', name: 'Entertainment', icon: 'film' },
  { id: 'health', name: 'Health', icon: 'medkit' },
  { id: 'science', name: 'Science', icon: 'flask' },
  { id: 'sports', name: 'Sports', icon: 'basketball' },
  { id: 'technology', name: 'Technology', icon: 'hardware-chip' },
  { id: 'web3', name: 'Web3', icon: 'globe' }
];

export default function ExploreScreen() {
  const privateKey = process.env.EXPO_PUBLIC_NEWS_API_KEY;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');

  const fetchNewsByCategory = async (category: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${category}&q=malaysia&apiKey=${privateKey}`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'ok') {
        const validArticles = data.articles.filter(
          (article: any) => article.title && article.description
        );
        
        setArticles(validArticles);
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Failed to load news: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const searchNews = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setSelectedCategory(null);
    
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=relevancy&apiKey=${privateKey}`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'ok') {
        const validArticles = data.articles.filter(
          (article: any) => article.title && article.description
        );
        
        setArticles(validArticles);
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Failed to load news: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    fetchNewsByCategory(categoryId);
  };

  const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem,
        selectedCategory === item.id && { backgroundColor: tintColor }
      ]}
      onPress={() => handleCategoryPress(item.id)}
    >
      <Ionicons 
        name={item.icon as any} 
        size={24} 
        color={selectedCategory === item.id ? '#000' : textColor} 
      />
      <ThemedText 
        style={styles.categoryText}
        lightColor={selectedCategory === item.id ? '#000' : undefined}
        darkColor={selectedCategory === item.id ? '#000' : undefined}
      >
        {item.name}
      </ThemedText>
    </TouchableOpacity>
  );

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
        <ThemedText type="title">Discover</ThemedText>
      </View>
      
      {/* Search Bar */}
      <View style={[styles.searchContainer, { borderColor: iconColor }]}>
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search news..."
          placeholderTextColor={iconColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchNews}
        />
        <TouchableOpacity onPress={searchNews} style={styles.searchButton}>
          <Ionicons name="search" size={24} color={tintColor} />
        </TouchableOpacity>
      </View>
      
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {/* News Content */}
      <View style={styles.newsContainer}>
        {loading ? (
          <Loader message={selectedCategory ? `Loading ${selectedCategory} news...` : 'Searching...'} isFullScreen />
        ) : error ? (
          <View style={styles.centered}>
            <ThemedText type="subtitle" style={styles.errorText}>{error}</ThemedText>
          </View>
        ) : articles.length === 0 ? (
          <View style={styles.centered}>
            <ThemedText type="subtitle">
              {selectedCategory || searchQuery 
                ? 'No news found' 
                : 'Select a category or search to find news'}
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={articles}
            renderItem={renderNewsItem}
            keyExtractor={(item, index) => `${item.title}-${index}`}
            contentContainerStyle={styles.newsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      
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
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    height: 50,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
  },
  searchButton: {
    padding: 10,
  },
  categoriesContainer: {
    height: 50,
    marginBottom: 8,
  },
  categoriesList: {
    paddingBottom: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    minWidth: 100,
    height: 40,
  },
  categoryText: {
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 14,
  },
  newsContainer: {
    flex: 1,
  },
  newsList: {
    paddingTop: 8,
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
