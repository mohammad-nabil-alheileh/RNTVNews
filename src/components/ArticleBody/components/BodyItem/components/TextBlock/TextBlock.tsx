import React, { memo } from 'react';
import { Text } from 'react-native';
import { autoDirection } from '../../../../../../platform/textDirection/textDirection';
import { useStyles } from '../../../../../../theme/theme';
import { makeStyles } from './TextBlock.styles';
import { TextBlockProps } from './TextBlock.types';

function TextBlockView({ block }: TextBlockProps) {
  const styles = useStyles(makeStyles);
  const text = block.kind === 'listItem' ? `•  ${block.text}` : block.text;

  return (
    <Text {...autoDirection} style={styles[block.kind]}>
      {text}
    </Text>
  );
}

export const TextBlock = memo(TextBlockView);
