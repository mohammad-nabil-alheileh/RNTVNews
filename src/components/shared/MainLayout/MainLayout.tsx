import React from 'react';
import { View } from 'react-native';
import { useStyles } from '../../../theme/theme';
import { NavBar } from './components/NavBar/NavBar';
import { makeStyles } from './MainLayout.styles';
import { MainLayoutProps } from './MainLayout.types';

export function MainLayout({ current, children }: MainLayoutProps) {
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.screen}>
      <NavBar current={current} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}
