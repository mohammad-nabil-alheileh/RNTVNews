import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { FocusableButton } from '../shared/FocusableButton/FocusableButton';
import { FocusGroup } from '../shared/FocusGroup/FocusGroup';
import { makeStyles } from './SettingOption.styles';
import { SettingOptionProps } from './SettingOption.types';

export function SettingOption({
  title,
  options,
  selected,
  onSelect,
  hasTVPreferredFocus,
}: SettingOptionProps) {
  const styles = useStyles(makeStyles);
  const [selectedOption, setSelectedOption] = useState<View | null>(null);

  return (
    <View>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <FocusGroup
        remember
        trap={['left', 'right']}
        entry={selectedOption}
        style={styles.options}
      >
        {options.map(option => (
          <FocusableButton
            key={option.value}
            ref={option.value === selected ? setSelectedOption : undefined}
            label={option.label}
            selected={option.value === selected}
            hasTVPreferredFocus={
              hasTVPreferredFocus && option.value === selected
            }
            onPress={() => onSelect(option.value)}
          />
        ))}
      </FocusGroup>
    </View>
  );
}
