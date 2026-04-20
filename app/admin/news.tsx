import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store';
import { NewsPost } from '../../types';

export default function NewsManagement() {
  const router = useRouter();
  const { news, addNews, deleteNews, theme } = useStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1502602898657-3e917247a184?w=800');

  const isDark = theme === 'dark';

  const handleAddNews = () => {
    if (!title || !content) {
      Alert.alert('Error', 'Please fill in the title and content.');
      return;
    }

    const newPost: NewsPost = {
      id: Date.now().toString(),
      title,
      subtitle: subtitle || content.substring(0, 50) + '...',
      content,
      image: image || 'https://images.unsplash.com/photo-1502602898657-3e917247a184?w=800',
      createdAt: new Date().toISOString(),
      author: 'Admin',
    };

    addNews(newPost);
    setIsModalVisible(false);
    setTitle('');
    setSubtitle('');
    setContent('');
    Alert.alert('Success', 'News post has been published.');
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.textWhite]}>News Management</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setIsModalVisible(true)}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {news.map((item) => (
          <View key={item.id} style={[styles.newsCard, isDark && styles.cardDark]}>
            <Image source={{ uri: item.image }} style={styles.newsImage} />
            <View style={styles.newsInfo}>
              <Text style={[styles.newsTitle, isDark && styles.textWhite]}>{item.title}</Text>
              <Text style={styles.newsDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              <TouchableOpacity 
                style={styles.deleteBtn} 
                onPress={() => deleteNews(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={isModalVisible} animationType="slide">
        <View style={[styles.modalContainer, isDark && styles.containerDark]}>
          <View style={[styles.modalHeader, isDark && styles.headerDark]}>
            <Text style={[styles.modalTitle, isDark && styles.textWhite]}>New Post</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#FFF' : '#000'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={[styles.label, isDark && styles.textWhite]}>Title</Text>
            <TextInput 
              style={[styles.input, isDark && styles.inputDark]} 
              value={title} 
              onChangeText={setTitle}
              placeholder="Post title..."
              placeholderTextColor="#666"
            />

            <Text style={[styles.label, isDark && styles.textWhite]}>Subtitle</Text>
            <TextInput 
              style={[styles.input, isDark && styles.inputDark]} 
              value={subtitle} 
              onChangeText={setSubtitle}
              placeholder="Short summary..."
              placeholderTextColor="#666"
            />

            <Text style={[styles.label, isDark && styles.textWhite]}>Image URL</Text>
            <TextInput 
              style={[styles.input, isDark && styles.inputDark]} 
              value={image} 
              onChangeText={setImage}
            />

            <Text style={[styles.label, isDark && styles.textWhite]}>Content</Text>
            <TextInput 
              style={[styles.input, isDark && styles.inputDark, styles.textArea]} 
              value={content} 
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              placeholder="Full article content..."
              placeholderTextColor="#666"
            />

            <TouchableOpacity style={styles.publishBtn} onPress={handleAddNews}>
              <Text style={styles.publishBtnText}>PUBLISH POST</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  containerDark: { backgroundColor: '#000' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    paddingBottom: 20, 
    backgroundColor: '#FFF' 
  },
  headerDark: { backgroundColor: '#0A0A0A', borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  textWhite: { color: '#FFF' },
  addBtn: { backgroundColor: '#0066CC', padding: 8, borderRadius: 10 },
  scrollContent: { padding: 20 },
  newsCard: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    marginBottom: 16, 
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardDark: { backgroundColor: '#0A0A0A', borderWidth: 1, borderColor: '#1A1A1A' },
  newsImage: { width: 100, height: 100 },
  newsInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  newsTitle: { fontSize: 14, fontWeight: '700' },
  newsDate: { fontSize: 12, color: '#666' },
  deleteBtn: { alignSelf: 'flex-end' },
  modalContainer: { flex: 1 },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    paddingBottom: 20,
    backgroundColor: '#FFF'
  },
  modalTitle: { fontSize: 20, fontWeight: '900' },
  modalBody: { padding: 20 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: 16, textTransform: 'uppercase' },
  input: { 
    backgroundColor: '#F3F4F6', 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 16, 
    color: '#000' 
  },
  inputDark: { backgroundColor: '#111', color: '#FFF', borderWidth: 1, borderColor: '#222' },
  textArea: { height: 120, textAlignVertical: 'top' },
  publishBtn: { 
    backgroundColor: '#FFD400', 
    paddingVertical: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 30,
    marginBottom: 50 
  },
  publishBtnText: { color: '#000', fontWeight: '900', letterSpacing: 1 }
});
