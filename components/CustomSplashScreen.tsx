import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image, Platform } from 'react-native';
import { useStore } from '../store';

const { width, height } = Dimensions.get('window');

interface CustomSplashScreenProps {
  onFinish: () => void;
}

export const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({ onFinish }) => {
  const { apiSettings } = useStore();
  const { branding } = apiSettings;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const bgScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Background Zoom Effect
    Animated.timing(bgScaleAnim, {
      toValue: 1.2,
      duration: 5000,
      useNativeDriver: true,
    }).start();

    // Content Entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 10,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();

    // Auto-finish after 2 seconds - Faster for better UX
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        console.log('[Imperial Engine] Handshake Complete - Hiding Splash');
        onFinish();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Dynamic Background */}
      <Animated.View 
        style={[
          styles.background, 
          { transform: [{ scale: bgScaleAnim }] }
        ]} 
      />
      
      {/* Decorative Gradient Overlay (Simulated) */}
      <View style={styles.overlay} />

      {/* Main Content */}
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ] 
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.brandName}>{branding.companyName.toUpperCase()}</Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>Establishing Imperial Connection...</Text>
        </View>

        <View style={styles.loaderContainer}>
          <Animated.View style={[styles.loader, { opacity: fadeAnim }]} />
        </View>

        <View style={styles.blessingContainer}>
          <Text style={styles.blessingText}>وَقُل رَّبِّ زِدْنِي عِلْمًا</Text>
          <Text style={styles.blessingText}>from god in my project make me number 1 in world</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000', // OLED Pure Black
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)', // Darker overlay
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.8,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#ed7430', // CEO's Orange
    borderRadius: 20, // More modern rounded square
    padding: 0,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ed7430',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ed7430', // CEO's Orange
    letterSpacing: 6,
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 1, // Thinner line
    backgroundColor: 'rgba(237, 116, 48, 0.3)', // Faded orange
    marginVertical: 20,
    borderRadius: 2,
  },
  tagline: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 2,
    textAlign: 'center',
    opacity: 0.7,
  },
  footer: {
    position: 'absolute',
    bottom: -150,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  blessingContainer: {
    position: 'absolute',
    bottom: 20,
    opacity: 0.05, // Almost invisible
    transform: [{ scale: 0.1 }], // Tiny
  },
  blessingText: {
    color: '#FFFFFF',
    fontSize: 10,
    textAlign: 'center',
  },
  loaderContainer: {
    width: 120,
    height: 1,
    backgroundColor: 'rgba(255,212,0,0.1)',
    borderRadius: 1,
    overflow: 'hidden',
    marginTop: 20,
  },
  loader: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ed7430',
  },
});
