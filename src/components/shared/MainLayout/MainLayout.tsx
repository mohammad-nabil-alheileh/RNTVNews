import React from 'react';
import { View } from 'react-native';
import { useStyles } from '../../../hooks/useStyles/useStyles';
import { FocusGroup } from '../FocusGroup/FocusGroup';
import { NavBar } from './components/NavBar/NavBar';
import { makeStyles } from './MainLayout.styles';
import { MainLayoutProps } from './MainLayout.types';

export function MainLayout({ current, children }: MainLayoutProps) {
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.screen}>
      <NavBar current={current} />
      <FocusGroup trap={['left', 'right']} style={styles.content}>
        {children}
      </FocusGroup>
    </View>
  );
}
