import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { colors } from '../constants/theme';
import { CanvasScreen } from '../screens/CanvasScreen';
import { GalleryScreen } from '../screens/GalleryScreen';
import { ViewerScreen } from '../screens/ViewerScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Navigatsiya: Kanvas (bosh ekran) → Galereya → Rasmni ko'rish. */
export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Canvas"
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Canvas" component={CanvasScreen} options={{ title: "Mo'yqalam" }} />
        <Stack.Screen name="Gallery" component={GalleryScreen} options={{ title: 'Mening rasmlarim' }} />
        <Stack.Screen name="Viewer" component={ViewerScreen} options={{ title: 'Rasm' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
