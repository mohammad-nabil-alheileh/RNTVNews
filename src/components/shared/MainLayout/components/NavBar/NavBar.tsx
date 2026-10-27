import React, { useState } from 'react';
import { View } from 'react-native';
import {
  CommonActions,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { useStyles } from '../../../../../hooks/useStyles/useStyles';
import { FocusableButton } from '../../../FocusableButton/FocusableButton';
import { FocusGroup } from '../../../FocusGroup/FocusGroup';
import { MainSection } from '../../MainLayout.types';
import { makeStyles } from './NavBar.styles';
import { NavBarProps, NavItem } from './NavBar.types';
import { useTranslation } from '../../../../../hooks/useTranslation/useTranslation';

const NAV_ITEMS: NavItem[] = [
  { section: 'Home', labelKey: 'navHome' },
  { section: 'Category', labelKey: 'navCategories' },
  { section: 'Search', labelKey: 'navSearch' },
  { section: 'Saved', labelKey: 'navSaved' },
  { section: 'Settings', labelKey: 'navSettings' },
];

const paramsOf = (section: MainSection) =>
  section === 'Category' ? {} : undefined;

export function NavBar({ current }: NavBarProps) {
  const t = useTranslation();
  const styles = useStyles(makeStyles);
  const navigation = useNavigation();
  const [homeButton, setHomeButton] = useState<View | null>(null);

  const open = (section: MainSection) => {
    if (section === current) {
      return;
    }
    if (section === 'Home') {
      navigation.dispatch(StackActions.popTo('Home'));
    } else if (current === 'Home') {
      navigation.dispatch(CommonActions.navigate(section, paramsOf(section)));
    } else {
      navigation.dispatch(StackActions.replace(section, paramsOf(section)));
    }
  };

  return (
    <FocusGroup trap={['left', 'right']} entry={homeButton} style={styles.bar}>
      {NAV_ITEMS.map(item => (
        <FocusableButton
          key={item.section}
          ref={item.section === 'Home' ? setHomeButton : undefined}
          label={t(item.labelKey)}
          selected={item.section === current}
          onPress={() => open(item.section)}
        />
      ))}
    </FocusGroup>
  );
}
