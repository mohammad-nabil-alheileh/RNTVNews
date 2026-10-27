import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { signOut } from '../../api/auth';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog/ConfirmDialog';
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
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
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
        <View>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            {t('account')}
          </Text>
          <Text style={styles.accountName}>{t('signedInWithPhone')}</Text>
          <FocusGroup trap={['left', 'right']} style={styles.row}>
            <FocusableButton
              label={t('signOut')}
              onPress={() => setConfirmingSignOut(true)}
            />
          </FocusGroup>
        </View>
        <FocusGroup trap={['left', 'right']} style={styles.row}>
          <FocusableButton
            label={t('aboutThisApp')}
            onPress={() => navigation.navigate('About')}
          />
        </FocusGroup>
      </View>
      <ConfirmDialog
        visible={confirmingSignOut}
        title={t('signOutTitle')}
        message={t('signOutMessage')}
        confirmLabel={t('signOut')}
        cancelLabel={t('cancel')}
        onConfirm={signOut}
        onCancel={() => setConfirmingSignOut(false)}
      />
    </MainLayout>
  );
}
