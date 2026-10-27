import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { AboutInfo } from '../../components/AboutInfo/AboutInfo';
import { FocusableButton } from '../../components/shared/FocusableButton/FocusableButton';
import { FocusGroup } from '../../components/shared/FocusGroup/FocusGroup';
import { MainLayout } from '../../components/shared/MainLayout/MainLayout';
import { APP_VERSION } from '../../config/appVersion';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { getDeviceInfo } from '../../platform/deviceInfo/deviceInfo';
import { ScreenProps } from '../../types/navigation';
import { makeStyles } from './AboutScreen.styles';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';

export function AboutScreen({ navigation }: ScreenProps<'About'>) {
  const t = useTranslation();
  const styles = useStyles(makeStyles);

  const rows = useMemo(() => {
    const device = getDeviceInfo();
    return [
      { label: t('app'), value: t('appName') },
      { label: t('appVersion'), value: APP_VERSION },
      { label: t('deviceModel'), value: device.model },
      { label: t('operatingSystem'), value: device.os },
      { label: t('osVersion'), value: device.osVersion },
    ];
  }, [t]);

  return (
    <MainLayout current="Settings">
      <View style={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          {t('about')}
        </Text>
        <AboutInfo rows={rows} />
        <FocusGroup trap={['left', 'right']} style={styles.actions}>
          <FocusableButton
            label={t('back')}
            onPress={() => navigation.goBack()}
            hasTVPreferredFocus
          />
        </FocusGroup>
      </View>
    </MainLayout>
  );
}
