import React from 'react';
import {
  CommonActions,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { useLanguage } from '../../../../../i18n/language';
import { useStyles } from '../../../../../theme/theme';
import { FocusableButton } from '../../../FocusableButton/FocusableButton';
import { FocusGroup } from '../../../FocusGroup/FocusGroup';
import { MainSection } from '../../MainLayout.types';
import { makeStyles } from './NavBar.styles';
import { NavBarProps, NavItem } from './NavBar.types';

const NAV_ITEMS: NavItem[] = [
  { section: 'Home', label: { en: 'Home', ar: 'الرئيسية' } },
  { section: 'Category', label: { en: 'Categories', ar: 'الأقسام' } },
  { section: 'Search', label: { en: 'Search', ar: 'بحث' } },
  { section: 'Saved', label: { en: 'Saved', ar: 'المحفوظات' } },
  { section: 'Settings', label: { en: 'Settings', ar: 'الإعدادات' } },
];

const paramsOf = (section: MainSection) =>
  section === 'Category' ? {} : undefined;

export function NavBar({ current }: NavBarProps) {
  const styles = useStyles(makeStyles);
  const language = useLanguage();
  const navigation = useNavigation();

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
    <FocusGroup remember trap={['left', 'right']} style={styles.bar}>
      {NAV_ITEMS.map(item => (
        <FocusableButton
          key={item.section}
          label={item.label[language]}
          selected={item.section === current}
          onPress={() => open(item.section)}
        />
      ))}
    </FocusGroup>
  );
}
