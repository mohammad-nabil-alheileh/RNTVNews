import React, { useCallback, useState } from 'react';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { FocusGroup } from '../shared/FocusGroup/FocusGroup';
import { Key } from './components/Key/Key';
import { KEYBOARD_LAYOUTS, LAYOUT_SWITCH_LABEL } from './keyboardLayouts';
import { makeStyles } from './SearchKeyboard.styles';
import { KeyboardLayout, SearchKeyboardProps } from './SearchKeyboard.types';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';

export function SearchKeyboard({
  onType,
  onDelete,
  onClear,
}: SearchKeyboardProps) {
  const t = useTranslation();
  const styles = useStyles(makeStyles);
  const [layout, setLayout] = useState<KeyboardLayout>('en');

  const switchLayout = useCallback(
    () => setLayout(current => (current === 'en' ? 'ar' : 'en')),
    [],
  );
  const typeSpace = useCallback(() => onType(' '), [onType]);

  return (
    <FocusGroup remember trap={['left', 'down']} style={styles.keys}>
      {KEYBOARD_LAYOUTS[layout].map((char, index) => (
        <Key
          key={char}
          label={char}
          value={char}
          onPress={onType}
          hasTVPreferredFocus={index === 0}
        />
      ))}
      <Key label={t('space')} value=" " onPress={typeSpace} wide />
      <Key label={t('delete')} value="" onPress={onDelete} wide />
      <Key label={t('clear')} value="" onPress={onClear} wide />
      <Key
        label={LAYOUT_SWITCH_LABEL[layout]}
        value=""
        onPress={switchLayout}
        wide
      />
    </FocusGroup>
  );
}
