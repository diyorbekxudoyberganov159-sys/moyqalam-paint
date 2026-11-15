import { DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { colors, fonts } from '../constants/theme';
import { CanvasScreen } from '../screens/CanvasScreen';
import { GalleryScreen } from '../screens/GalleryScreen';
import { ViewerScreen } from '../screens/ViewerScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Navigatsiya ranglari ilova dizayniga moslangan (to'q mavzu). */
const theme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
  },
};

/** Navigatsiya: Kanvas (bosh ekran) → Mening rasmlarim → Rasmni ko'rish. */
export function AppNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Canvas"
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: fonts.semibold, fontSize: 16 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Canvas"
          component={CanvasScreen}
          options={{ headerShown: false, title: "Mo'yqalam" }}
        />
        <Stack.Screen name="Gallery" component={GalleryScreen} options={{ title: '' }} />
        <Stack.Screen name="Viewer" component={ViewerScreen} options={{ title: 'Rasm' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
