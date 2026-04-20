import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

export const Logo: React.FC<{ size?: 'small' | 'large', mode?: 'full' | 'icon' }> = ({ size = 'small' }) => {
  const isLarge = size === 'large';

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/company-logo.png')} 
        style={[
          styles.logoImage, 
          isLarge ? styles.logoLarge : styles.logoSmall
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    // Aspect ratio of the original logo is roughly 3:1 based on the image provided
  },
  logoSmall: {
    width: 120,
    height: 40,
  },
  logoLarge: {
    width: 240,
    height: 80,
  },
});
