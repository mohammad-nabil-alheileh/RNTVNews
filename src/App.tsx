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
import { expireLists, loadListCache } from './api/listCache';
import { onAppResume } from './platform/appState/appState';
import { loadSaved } from './api/savedStore';
import { loadSettings } from './api/settingsStore';
import { getSession, loadSession } from './api/sessionStore';
import { useSession } from './hooks/useSession/useSession';
import { useSettings } from './hooks/useSettings/useSettings';
import { startSpatialNavigation } from './platform/spatialNavigation/spatialNavigation';
import { useTheme } from './hooks/useTheme/useTheme';
import { useAppLinks } from './hooks/useAppLinks/useAppLinks';
import { AppLink } from './types/appLink';
import { ScreenLayoutProps } from './App.types';
import { RootStackParamList } from './types/navigation';
import { HomeScreen } from './screens/HomeScreen/HomeScreen';
import { CategoryScreen } from './screens/CategoryScreen/CategoryScreen';
import { ArticleScreen } from './screens/ArticleScreen/ArticleScreen';
import { SearchScreen } from './screens/SearchScreen/SearchScreen';
import { SavedScreen } from './screens/SavedScreen/SavedScreen';
import { SettingsScreen } from './screens/SettingsScreen/SettingsScreen';
import { AboutScreen } from './screens/AboutScreen/AboutScreen';
import { SignInScreen } from './screens/SignInScreen/SignInScreen';

const STALE_AFTER_MS = 60 * 1000;

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

startSpatialNavigation();
startConnectionWatch();
loadSettings();
loadSaved();
loadSession();
onAppResume(awayMs => {
  if (awayMs >= STALE_AFTER_MS) {
    expireLists();
  }
});
loadListCache(['top', ...CATEGORIES.map(category => category.tag)]);

function ScreenLayout({ children }: ScreenLayoutProps) {
  return <ScreenFrame>{children}</ScreenFrame>;
}

function routeOf(link: AppLink) {
  switch (link.screen) {
    case 'Category':
      return { name: link.screen, params: { tag: link.tag } };
    case 'Article':
      return { name: link.screen, params: { storyId: link.storyId } };
    case 'Search':
      return { name: link.screen, params: { query: link.query } };
    default:
      return { name: link.screen };
  }
}

function openLinkOverHome(link: AppLink) {
  if (link.screen === 'Home') {
    navigationRef.reset({ index: 0, routes: [{ name: 'Home' }] });
    return;
  }
  navigationRef.reset({
    index: 1,
    routes: [{ name: 'Home' }, routeOf(link)],
  });
}

function AppContent() {
  const { colors } = useTheme();
  const { session } = useSession();
  const [exitVisible, setExitVisible] = useState(false);
  const [waitingLink, setWaitingLink] = useState<AppLink | null>(null);

  const hideExit = useCallback(() => setExitVisible(false), []);

  const openLink = useCallback((link: AppLink) => {
    setExitVisible(false);
    if (getSession().session) {
      openLinkOverHome(link);
    } else {
      setWaitingLink(link);
      navigationRef.navigate('SignIn', {
        linkWaiting: link.screen === 'Article' ? 'story' : 'page',
      });
    }
  }, []);
  const onNavigationReady = useAppLinks(openLink);

  useEffect(() => {
    if (session && waitingLink !== null) {
      setWaitingLink(null);
      openLinkOverHome(waitingLink);
    }
  }, [session, waitingLink]);

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
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      onReady={onNavigationReady}
    >
      <Stack.Navigator
        screenLayout={ScreenLayout}
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {session ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen name="Article" component={ArticleScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Saved" component={SavedScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
          </>
        ) : (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        )}
      </Stack.Navigator>
      <ExitDialog visible={exitVisible} onStay={hideExit} onExit={exitApp} />
    </NavigationContainer>
  );
}

export default function App() {
  const { loaded } = useSettings();
  const { loaded: sessionLoaded } = useSession();
  return loaded && sessionLoaded ? <AppContent /> : null;
}
