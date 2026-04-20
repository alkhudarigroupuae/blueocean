import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useStore } from '../store';
import { Logo } from './Logo';
import { Colors } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack, onBack }) => {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <View style={[
      styles.header, 
      { backgroundColor: isDark ? '#000000' : '#FFFFFF' },
      { borderBottomWidth: 1, borderBottomColor: isDark ? '#111111' : '#F4F4F5' }
    ]}>
      <View style={styles.headerContent}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={[styles.backButton, { backgroundColor: isDark ? '#111111' : '#F4F4F5' }]}>
              <Ionicons name="arrow-back" size={20} color={isDark ? '#FFFFFF' : '#111827'} />
            </TouchableOpacity>
          )}
          <View style={styles.logoContainer}>
            <Logo size="small" />
            {title && (
              <View style={styles.titleWrapper}>
                <View style={[styles.titleDivider, { backgroundColor: isDark ? '#222222' : '#E5E7EB' }]} />
                <Text style={[styles.pageTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>{title}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.headerRight} />
      </View>
    </View>
  );
};

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder, onSubmit }) => {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <View style={[
      styles.searchContainer, 
      isDark ? { 
        backgroundColor: '#0A0A0A', 
        borderColor: '#27272A', 
        borderWidth: 1,
      } : {
        backgroundColor: '#F4F4F5',
        borderColor: '#F4F4F5',
        borderWidth: 1,
      }
    ]}>
      <Ionicons name="search-outline" size={18} color={isDark ? '#71717A' : '#71717A'} style={styles.searchIcon} />
      <TextInput
        style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#111827' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || 'Search destinations...'}
        placeholderTextColor={isDark ? '#52525B' : '#A1A1AA'}
        onSubmitEditing={onSubmit}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={18} color={isDark ? '#52525B' : '#A1A1AA'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', disabled }) => {
  const { apiSettings } = useStore();
  const primaryColor = apiSettings.branding.primaryColor || Colors.primary;

  const buttonStyles = [
    styles.button,
    variant === 'primary' && { backgroundColor: primaryColor },
    variant === 'secondary' && { backgroundColor: '#27272A' },
    variant === 'outline' && { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#27272A' },
    disabled && { opacity: 0.5 },
  ];
  
  const textStyles = [
    styles.buttonText,
    variant === 'primary' && { color: '#000000' },
    variant === 'secondary' && { color: '#FFFFFF' },
    variant === 'outline' && { color: '#FFFFFF' },
  ];

  return (
    <TouchableOpacity 
      style={buttonStyles} 
      onPress={onPress} 
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[textStyles, { fontWeight: '800', letterSpacing: 0.5 }]}>{title.toUpperCase()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 20,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    width: 40,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleDivider: {
    width: 1,
    height: 20,
    marginHorizontal: 12,
  },
  pageTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 52,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
  },
});