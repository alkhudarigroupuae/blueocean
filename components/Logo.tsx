import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store';
import { Colors } from '../types';

export const Logo: React.FC<{ size?: 'small' | 'large', mode?: 'full' | 'icon' }> = ({ size = 'small', mode }) => {
  const router = useRouter();
  const isLarge = size === 'large';
  const { apiSettings, theme } = useStore();
  const { branding } = apiSettings;
  const isDark = theme === 'dark';
  const primaryColor = branding.primaryColor || Colors.primary;

  const renderLogo = () => {
    // If explicit mode is icon, always return the image icon
    if (mode === 'icon') {
      return (
        <Image 
          source={require('../assets/icon.png')} 
          style={isLarge ? styles.logoLarge : styles.logoSmall}
          resizeMode="contain"
        />
      );
    }

    const companyParts = branding.companyName.split('.');
    const mainName = companyParts[0];
    const extension = companyParts[1] ? `.${companyParts[1]}` : '';

    switch (branding.logoType) {
      case 'FullText':
        return (
          <View style={styles.textWrapper}>
            <Text style={[styles.brandText, isLarge ? styles.textLarge : styles.textSmall, { color: primaryColor }]}>
              {mainName.toUpperCase()}
            </Text>
            <Text style={[styles.groupText, isLarge ? styles.groupLarge : styles.groupSmall, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              {extension.toUpperCase()}
            </Text>
          </View>
        );
      case 'Hybrid':
        return (
          <View style={styles.hybridContainer}>
            <Image 
              source={require('../assets/icon.png')} 
              style={isLarge ? styles.logoLarge : styles.logoSmall}
              resizeMode="contain"
            />
            <View style={styles.hybridTextWrapper}>
              <Text style={[styles.brandText, isLarge ? styles.textMedium : styles.textXSmall, { color: primaryColor }]}>
                {mainName.toUpperCase()}
              </Text>
              <Text style={[styles.groupText, isLarge ? styles.groupMedium : styles.groupXSmall, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                {extension.toUpperCase()}
              </Text>
            </View>
          </View>
        );
      case 'Icon':
      default:
        return (
          <Image 
            source={require('../assets/icon.png')} 
            style={isLarge ? styles.logoLarge : styles.logoSmall}
            resizeMode="contain"
          />
        );
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={() => router.push('/(tabs)')}
      style={styles.container}
    >
      {renderLogo()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSmall: {
    width: 32,
    height: 32,
  },
  logoLarge: {
    width: 80,
    height: 80,
  },
  textWrapper: {
    alignItems: 'center',
  },
  brandText: {
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  textSmall: {
    fontSize: 18,
  },
  textLarge: {
    fontSize: 32,
  },
  groupText: {
    fontWeight: '300',
    letterSpacing: 4,
  },
  groupSmall: {
    fontSize: 10,
    marginTop: -4,
  },
  groupLarge: {
    fontSize: 14,
    marginTop: -6,
  },
  hybridContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hybridTextWrapper: {
    marginLeft: 10,
  },
  textMedium: {
    fontSize: 24,
    lineHeight: 24,
  },
  textXSmall: {
    fontSize: 16,
    lineHeight: 16,
  },
  groupMedium: {
    fontSize: 10,
    marginTop: -2,
  },
  groupXSmall: {
    fontSize: 8,
    marginTop: -2,
  },
});