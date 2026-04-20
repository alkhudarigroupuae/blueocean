import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CustomSplashScreen } from '../components/CustomSplashScreen';
import { Colors } from '../types';

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <>
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