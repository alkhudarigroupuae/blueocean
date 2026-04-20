import React, { useState } from 'react';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { CustomSplashScreen } from '../components/CustomSplashScreen';
import { Colors } from '../types';

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <>
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BlueOcean" />
        <link rel="apple-touch-icon" href="/assets/icon.png" />
        <meta name="theme-color" content="#0066CC" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <StatusBar style={isSplashVisible ? "light" : "dark"} />
      
      {isSplashVisible && (
        <CustomSplashScreen onFinish={() => setIsSplashVisible(false)} />
      )}

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.backgroundLight },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="destination/[id]" 
          options={{ 
            presentation: 'card',
            animation: 'slide_from_right',
          }} 
        />
        <Stack.Screen 
          name="booking/[id]" 
          options={{ 
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }} 
        />
        <Stack.Screen 
          name="confirmation" 
          options={{ 
            presentation: 'fullScreenModal',
            animation: 'fade',
          }} 
        />
      </Stack>
    </>
  );
}