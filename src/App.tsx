import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createNavigationContainerRef,
  DarkTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExitDialog } from './components/ExitDialog/ExitDialog';
import { ScreenFrame } from './components/shared/ScreenFrame/ScreenFrame';
import { exitApp, onBack } from './platform/back/back';
import { CATEGORIES } from './api/categories';
import { startConnectionWatch } from './api/connection';
import { loadListCache } from './api/listCache';
import { loadSaved } from './api/savedStore';
import { loadSettings } from './api/settingsStore';
import { useSettings } from './hooks/useSettings/useSettings';
import { startSpatialNavigation } from './platform/spatialNavigation/spatialNavigation';
import { useTheme } from './hooks/useTheme/useTheme';
import { ScreenLayoutProps } from './App.types';
import { RootStackParamList } from './types/navigation';
import { HomeScreen } from './screens/HomeScreen/HomeScreen';
import { CategoryScreen } from './screens/CategoryScreen/CategoryScreen';
import { ArticleScreen } from './screens/ArticleScreen/ArticleScreen';
import { SearchScreen } from './screens/SearchScreen/SearchScreen';
import { SavedScreen } from './screens/SavedScreen/SavedScreen';
import { SettingsScreen } from './screens/SettingsScreen/SettingsScreen';
import { AboutScreen } from './screens/AboutScreen/AboutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

startSpatialNavigation();
startConnectionWatch();
loadSettings();
loadSaved();
loadListCache(['top', ...CATEGORIES.map(category => category.tag)]);

function ScreenLayout({ children }: ScreenLayoutProps) {
  return <ScreenFrame>{children}</ScreenFrame>;
}

function AppContent() {
  const { colors } = useTheme();
  const [exitVisible, setExitVisible] = useState(false);

  const hideExit = useCallback(() => setExitVisible(false), []);

  useEffect(
    () =>
      onBack(() => {
        if (navigationRef.isReady() && navigationRef.canGoBack()) {
          navigationRef.goBack();
        } else {
          setExitVisible(true);
        }
        return true;
      }),
    [],
  );

  const navigationTheme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        primary: colors.accent,
      },
    }),
    [colors],
  );

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenLayout={ScreenLayout}
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Article" component={ArticleScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Saved" component={SavedScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
      <ExitDialog visible={exitVisible} onStay={hideExit} onExit={exitApp} />
    </NavigationContainer>
  );
}

export default function App() {
  const { loaded } = useSettings();
  return loaded ? <AppContent /> : null;
}
