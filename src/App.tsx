import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createNavigationContainerRef,
  DarkTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExitDialog } from './components/ExitDialog/ExitDialog';
import { ErrorBoundary } from './components/shared/ErrorBoundary/ErrorBoundary';
import { LanguageContext } from './i18n/language';
import { exitApp, onBack } from './platform/back/back';
import { startSpatialNavigation } from './platform/spatialNavigation/spatialNavigation';
import { useTheme } from './theme/theme';
import { ScreenLayoutProps } from './App.types';
import { Language } from './types/language';
import { RootStackParamList } from './types/navigation';
import { HomeScreen } from './screens/HomeScreen/HomeScreen';
import { CategoryScreen } from './screens/CategoryScreen/CategoryScreen';
import { ArticleScreen } from './screens/ArticleScreen/ArticleScreen';
import { SearchScreen } from './screens/SearchScreen/SearchScreen';
import { SavedScreen } from './screens/SavedScreen/SavedScreen';
import { SettingsScreen } from './screens/SettingsScreen/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

startSpatialNavigation();

function ScreenLayout({ children }: ScreenLayoutProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
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
      </Stack.Navigator>
      <ExitDialog visible={exitVisible} onStay={hideExit} onExit={exitApp} />
    </NavigationContainer>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const languageValue = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContext.Provider value={languageValue}>
      <AppContent />
    </LanguageContext.Provider>
  );
}
