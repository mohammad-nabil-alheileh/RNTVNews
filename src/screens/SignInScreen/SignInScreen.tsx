import React from 'react';
import { Text, View } from 'react-native';
import { QrCode } from '../../components/QrCode/QrCode';
import { SignInCode } from '../../components/SignInCode/SignInCode';
import { FocusableButton } from '../../components/shared/FocusableButton/FocusableButton';
import { FocusGroup } from '../../components/shared/FocusGroup/FocusGroup';
import { usePhoneSignIn } from '../../hooks/usePhoneSignIn/usePhoneSignIn';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import { ScreenProps } from '../../types/navigation';
import { makeStyles } from './SignInScreen.styles';

const QR_SIZE = 420;

export function SignInScreen({ route }: ScreenProps<'SignIn'>) {
  const styles = useStyles(makeStyles);
  const t = useTranslation();
  const { state, newCode } = usePhoneSignIn();
  const linkWaiting = route.params?.linkWaiting;

  return (
    <View style={styles.screen}>
      <View style={styles.info}>
        <Text style={styles.title} accessibilityRole="header">
          {t('signInTitle')}
        </Text>
        {linkWaiting ? (
          <Text style={styles.linkWaiting}>
            {t(linkWaiting === 'story' ? 'storyWaiting' : 'pageWaiting')}
          </Text>
        ) : null}
        <SignInCode state={state} />
        <FocusGroup
          trap={['left', 'right', 'up', 'down']}
          style={styles.actions}
        >
          <FocusableButton
            label={t('newCode')}
            onPress={() => newCode()}
            hasTVPreferredFocus
          />
        </FocusGroup>
      </View>
      <View style={styles.qrFrame}>
        <QrCode
          value={state.approveUrl}
          size={QR_SIZE}
          accessibilityLabel={t('qrLabel')}
        />
      </View>
    </View>
  );
}
