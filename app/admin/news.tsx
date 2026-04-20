import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, Modal, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store';
import { NewsPost } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_DESKTOP = SCREEN_WIDTH > 1024;

export default function NewsManagement() {
  const router = useRouter();
  const { news, addNews, deleteNews, theme } = useStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1502602898657-3e917247a184?w=800');

  const isDark = theme === 'dark';
  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#050505' : '#F9FAFB' },
    card: { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#1A1A1A' : '#E5E7EB' },
    text: { color: isDark ? '#FFFFFF' : '#111827' },
    subText: { color: isDark ? '#9CA3AF' : '#6B7280' },
  };

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
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Professional Header */}
      <View style={[styles.header, dynamicStyles.card]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={dynamicStyles.text.color} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, dynamicStyles.text]}>News Management</Text>
            <Text style={[styles.headerSub, dynamicStyles.subText]}>Publish and manage travel insights</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.addBtn} onPress={() => setIsModalVisible(true)}>
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addBtnText}>{IS_DESKTOP ? 'Create New Post' : 'Add'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.newsGrid, IS_DESKTOP && styles.newsGridDesktop]}>
          {news.map((item) => (
            <View key={item.id} style={[styles.newsCard, dynamicStyles.card, IS_DESKTOP && styles.newsCardDesktop]}>
              <Image source={{ uri: item.image }} style={styles.newsImage} />
              <View style={styles.newsInfo}>
                <View>
                  <Text style={[styles.newsTitle, dynamicStyles.text]} numberOfLines={2}>{item.title}</Text>
                  <Text style={[styles.newsDate, dynamicStyles.subText]}>
                    <Ionicons name="calendar-outline" size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.editBtn}>
                    <Ionicons name="create-outline" size={18} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteBtn} 
                    onPress={() => deleteNews(item.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modern Post Modal */}
      <Modal visible={isModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.card]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, dynamicStyles.text]}>Create New Post</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={dynamicStyles.text.color} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, dynamicStyles.subText]}>Title</Text>
                <TextInput 
                  style={[styles.input, dynamicStyles.card, dynamicStyles.text]} 
                  value={title} 
                  onChangeText={setTitle}
                  placeholder="Post title..."
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, dynamicStyles.subText]}>Subtitle</Text>
                <TextInput 
                  style={[styles.input, dynamicStyles.card, dynamicStyles.text]} 
                  value={subtitle} 
                  onChangeText={setSubtitle}
                  placeholder="Short summary..."
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, dynamicStyles.subText]}>Image URL</Text>
                <TextInput 
                  style={[styles.input, dynamicStyles.card, dynamicStyles.text]} 
                  value={image} 
                  onChangeText={setImage}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, dynamicStyles.subText]}>Content</Text>
                <TextInput 
                  style={[styles.input, dynamicStyles.card, dynamicStyles.text, styles.textArea]} 
                  value={content} 
                  onChangeText={setContent}
                  multiline
                  numberOfLines={6}
                  placeholder="Full article content..."
                  placeholderTextColor="#666"
                />
              </View>

              <TouchableOpacity style={styles.publishBtn} onPress={handleAddNews}>
                <Text style={styles.publishBtnText}>PUBLISH ARTICLE</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingHorizontal: 25, 
    paddingBottom: 25, 
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  backBtn: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.03)' },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  headerSub: { fontSize: 13, marginTop: 2 },
  addBtn: { 
    backgroundColor: '#0066CC', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 12,
    gap: 8,
  },
  addBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  scrollContent: { padding: 25 },
  newsGrid: { gap: 20 },
  newsGridDesktop: { flexDirection: 'row', flexWrap: 'wrap' },
  newsCard: { 
    flexDirection: 'row', 
    borderRadius: 20, 
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  newsCardDesktop: { width: '48%' },
  newsImage: { width: 120, height: '100%', backgroundColor: '#F3F4F6' },
  newsInfo: { flex: 1, padding: 20, justifyContent: 'space-between' },
  newsTitle: { fontSize: 15, fontWeight: '700', lineHeight: 22 },
  newsDate: { fontSize: 12, marginTop: 8, flexDirection: 'row', alignItems: 'center' },
  cardActions: { flexDirection: 'row', gap: 12, alignSelf: 'flex-end' },
  editBtn: { padding: 8, borderRadius: 10, backgroundColor: '#3B82F610' },
  deleteBtn: { padding: 8, borderRadius: 10, backgroundColor: '#EF444410' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 600, borderRadius: 24, padding: 30, borderWidth: 1, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  modalTitle: { fontSize: 22, fontWeight: '900' },
  modalBody: { gap: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '800', marginBottom: 8, letterSpacing: 1 },
  input: { padding: 15, borderRadius: 12, borderWidth: 1, fontSize: 16 },
  textArea: { height: 150, textAlignVertical: 'top' },
  publishBtn: { 
    backgroundColor: '#0066CC', 
    paddingVertical: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 10,
    marginBottom: 20 
  },
  publishBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15, letterSpacing: 1 }
});
