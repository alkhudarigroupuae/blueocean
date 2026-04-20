import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store';

export const Logo: React.FC<{ size?: 'small' | 'large', mode?: 'full' | 'icon' }> = ({ size = 'small', mode }) => {
  const router = useRouter();
  const isLarge = size === 'large';
  const { apiSettings } = useStore();
  const { branding } = apiSettings;

  const renderLogo = () => {
    // If explicit mode is icon, always return the icon
    if (mode === 'icon') {
      return (
        <Image 
          source={require('../assets/icon.png')} 
          style={isLarge ? styles.logoLarge : styles.logoSmall}
          resizeMode="contain"
        />
      );
    }

    switch (branding.logoType) {
      case 'FullText':
        return (
          <View style={styles.textWrapper}>
            <Text style={[styles.brandText, isLarge ? styles.textLarge : styles.textSmall]}>
              {branding.companyName.split(' ')[0].toUpperCase()}
            </Text>
            <Text style={[styles.groupText, isLarge ? styles.groupLarge : styles.groupSmall]}>
              {branding.companyName.split(' ').slice(1).join(' ').toUpperCase()}
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
              <Text style={[styles.brandText, isLarge ? styles.textMedium : styles.textXSmall]}>
                {branding.companyName.split(' ')[0].toUpperCase()}
              </Text>
              <Text style={[styles.groupText, isLarge ? styles.groupMedium : styles.groupXSmall]}>
                {branding.companyName.split(' ').slice(1).join(' ').toUpperCase()}
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
    width: 40,
    height: 40,
  },
  logoLarge: {
    width: 120,
    height: 120,
  },
  textWrapper: {
    alignItems: 'center',
  },
  brandText: {
    fontWeight: '900',
    letterSpacing: 1.5,
    color: '#000000',
  },
  textSmall: {
    fontSize: 18,
  },
  textLarge: {
    fontSize: 36,
  },
  textMedium: {
    fontSize: 24,
  },
  textXSmall: {
    fontSize: 14,
  },
  groupText: {
    fontWeight: '700',
    letterSpacing: 3,
    color: '#F97316',
    marginTop: -4,
  },
  groupSmall: {
    fontSize: 8,
  },
  groupLarge: {
    fontSize: 16,
  },
  groupMedium: {
    fontSize: 12,
  },
  groupXSmall: {
    fontSize: 6,
  },
  hybridContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hybridTextWrapper: {
    marginLeft: 10,
    alignItems: 'flex-start',
  },
});
