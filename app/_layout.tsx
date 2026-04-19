import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../types';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
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