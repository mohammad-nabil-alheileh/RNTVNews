import React, { memo, useCallback } from 'react';
import { Text, View } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage/useLanguage';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { FocusGroup } from '../shared/FocusGroup/FocusGroup';
import { makeStyles } from './CategoryRow.styles';
import { CategoryRowProps } from './CategoryRow.types';
import { RowBody } from './components/RowBody/RowBody';

function CategoryRowView({
  category,
  index,
  onPressStory,
  onFocusRow,
}: CategoryRowProps) {
  const styles = useStyles(makeStyles);
  const language = useLanguage();
  const label = category.label[language];
  const { tag } = category;

  const focusRow = useCallback(
    () => onFocusRow(tag, index),
    [onFocusRow, tag, index],
  );

  return (
    <View>
      <Text style={styles.title} accessibilityRole="header">
        {label}
      </Text>
      <FocusGroup trap={['left', 'right']} style={styles.body}>
        <RowBody
          tag={tag}
          label={label}
          onPressStory={onPressStory}
          onFocus={focusRow}
        />
      </FocusGroup>
    </View>
  );
}

export const CategoryRow = memo(CategoryRowView);
