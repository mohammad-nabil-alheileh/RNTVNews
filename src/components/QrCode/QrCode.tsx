import React, { memo, useMemo } from 'react';
import { PixelRatio, View } from 'react-native';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { layoutDirectionProps } from '../../platform/layoutDirection/layoutDirection';
import { qrRuns } from '../../utils/qrRuns/qrRuns';
import { makeStyles } from './QrCode.styles';
import { QrCodeProps } from './QrCode.types';

const QUIET_ZONE = 4;

function QrCodeView({ value, size, accessibilityLabel }: QrCodeProps) {
  const styles = useStyles(makeStyles);
  const { scale } = useTheme();
  const matrix = useMemo(() => qrRuns(value), [value]);
  const total = matrix.size + QUIET_ZONE * 2;
  const ratio = PixelRatio.get();
  const module = Math.max(1, Math.floor((scale(size) * ratio) / total)) / ratio;
  const directionProps = layoutDirectionProps('ltr');

  return (
    <View
      {...directionProps}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.box,
        { width: module * total, height: module * total },
        directionProps.style,
      ]}
    >
      {matrix.runs.map(run => (
        <View
          key={`${run.row}-${run.column}`}
          style={[
            styles.dark,
            {
              left: (run.column + QUIET_ZONE) * module,
              top: (run.row + QUIET_ZONE) * module,
              width: run.length * module,
              height: module,
            },
          ]}
        />
      ))}
    </View>
  );
}

export const QrCode = memo(QrCodeView);
