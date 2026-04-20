import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useStore } from '../store';
import { Logo } from './Logo';
import { Colors } from '../types';

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
      { borderBottomWidth: 1, borderBottomColor: isDark ? '#111111' : '#F3F4F6' }
    ]}>
      <View style={styles.headerContent}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={[styles.backButton, { backgroundColor: isDark ? '#111111' : '#F3F4F6' }]}>
              <Text style={[styles.backText, { color: isDark ? '#FFFFFF' : '#111' }]}>←</Text>
            </TouchableOpacity>
          )}
          <View style={styles.logoContainer}>
            <Logo size="small" />
            {title && (
              <View style={styles.titleWrapper}>
                <View style={[styles.titleDivider, { backgroundColor: isDark ? '#222' : '#E5E7EB' }]} />
                <Text style={[styles.pageTitle, { color: isDark ? '#FFFFFF' : '#111' }]}>{title}</Text>
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
    <View style={[styles.searchContainer, isDark && { backgroundColor: '#0A0A0A', borderColor: '#27272A', borderWidth: 1 }]}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={[styles.searchInput, isDark && { color: '#FFFFFF' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || 'Search destinations...'}
        placeholderTextColor={isDark ? '#52525B' : Colors.textMuted}
        onSubmitEditing={onSubmit}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Text style={styles.clearIcon}>✕</Text>
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
      <Text style={[textStyles, { fontWeight: '700' }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
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
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backText: {
    fontSize: 18,
    fontWeight: '700',
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
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 22,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  pageTitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  clearIcon: {
    fontSize: 16,
    color: Colors.textMuted,
    padding: 8,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  buttonDisabled: {
    backgroundColor: Colors.border,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  buttonTextOutline: {
    color: Colors.primary,
  },
});