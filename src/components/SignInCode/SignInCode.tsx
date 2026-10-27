import React from 'react';
import { Text, View } from 'react-native';
import { shortAddress } from '../../api/auth';
import { useCountdown } from '../../hooks/useCountdown/useCountdown';
import { useLanguage } from '../../hooks/useLanguage/useLanguage';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import { formatCountdown } from '../../utils/formatCountdown/formatCountdown';
import { makeStyles } from './SignInCode.styles';
import { SignInCodeProps } from './SignInCode.types';

export function SignInCode({ state }: SignInCodeProps) {
  const styles = useStyles(makeStyles);
  const t = useTranslation();
  const language = useLanguage();
  const secondsLeft = useCountdown(state.expiresAt);

  return (
    <View>
      {state.notice ? (
        <Text style={styles.notice} accessibilityLiveRegion="polite">
          {t('codeExpiredNotice')}
        </Text>
      ) : null}
      <Text style={styles.step}>{t('signInScan')}</Text>
      <Text style={styles.step}>{t('signInOrVisit')}</Text>
      <Text style={styles.address}>{shortAddress(state.code)}</Text>
      <Text style={styles.step}>{t('signInYourCode')}</Text>
      <Text
        style={styles.code}
        accessibilityLabel={state.code.split('').join(' ')}
      >
        {state.code}
      </Text>
      <Text style={styles.countdown}>
        {t('codeExpiresIn', { time: formatCountdown(secondsLeft, language) })}
      </Text>
      {state.connectionProblem ? (
        <Text style={styles.problem} accessibilityLiveRegion="polite">
          {t('signInRelayUnreachable')}
        </Text>
      ) : null}
    </View>
  );
}
