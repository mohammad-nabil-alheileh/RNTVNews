import React from 'react';
import { View } from 'react-native';
import { setLanguage, setTextSize } from '../../api/settingsStore';
import { SettingOption } from '../../components/SettingOption/SettingOption';
import { SettingOptionItem } from '../../components/SettingOption/SettingOption.types';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import { FocusableButton } from '../../components/shared/FocusableButton/FocusableButton';
import { FocusGroup } from '../../components/shared/FocusGroup/FocusGroup';
import { MainLayout } from '../../components/shared/MainLayout/MainLayout';
import { useSettings } from '../../hooks/useSettings/useSettings';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { Language } from '../../types/language';
import { ScreenProps } from '../../types/navigation';
import { TextSize } from '../../types/settings';
import { makeStyles } from './SettingsScreen.styles';

const TEXT_SIZES: TextSize[] = ['small', 'medium', 'large', 'extraLarge'];

const LANGUAGE_OPTIONS: SettingOptionItem[] = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' },
];

export function SettingsScreen({ navigation }: ScreenProps<'Settings'>) {
  const styles = useStyles(makeStyles);
  const { language, textSize } = useSettings();
  const t = useTranslation();
  const textSizeOptions: SettingOptionItem[] = TEXT_SIZES.map(size => ({
    value: size,
    label: t(size),
  }));

  return (
    <MainLayout current="Settings">
      <View style={styles.content}>
        <SettingOption
          title={t('textSize')}
          options={textSizeOptions}
          selected={textSize}
          onSelect={value => setTextSize(value as TextSize)}
          hasTVPreferredFocus
        />
        <SettingOption
          title={t('language')}
          options={LANGUAGE_OPTIONS}
          selected={language}
          onSelect={value => setLanguage(value as Language)}
        />
        <FocusGroup trap={['left', 'right']} style={styles.about}>
          <FocusableButton
            label={t('aboutThisApp')}
            onPress={() => navigation.navigate('About')}
          />
        </FocusGroup>
      </View>
    </MainLayout>
  );
}
