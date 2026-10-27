import React, { memo, useState } from 'react';
import { Pressable } from 'react-native';
import { formatShortDate } from '../../../../utils/formatShortDate/formatShortDate';
import { useLanguage } from '../../../../hooks/useLanguage/useLanguage';
import { preferredFocusProps } from '../../../../platform/preferredFocus/preferredFocus';
import { useStyles } from '../../../../hooks/useStyles/useStyles';
import { ArticleBodyItem } from '../../ArticleBody.types';
import { makeStyles } from './BodyItem.styles';
import { BodyItemProps } from './BodyItem.types';
import { ArticleHeader } from './components/ArticleHeader/ArticleHeader';
import { ImageBlock } from './components/ImageBlock/ImageBlock';
import { TextBlock } from './components/TextBlock/TextBlock';
import { useTranslation } from '../../../../hooks/useTranslation/useTranslation';

function labelOf(
  item: ArticleBodyItem,
  date: string,
  t: ReturnType<typeof useTranslation>,
): string {
  if (item.type === 'header') {
    const { title, author, readingMinutes } = item.story;
    return `${title}, ${author}, ${date}, ${t('minRead', {
      minutes: readingMinutes,
    })}`;
  }
  if (item.block.kind === 'image') {
    return item.block.alt || t('image');
  }
  return item.block.text;
}

function BodyItemView({
  item,
  index,
  width,
  onFocusItem,
  hasTVPreferredFocus,
}: BodyItemProps) {
  const styles = useStyles(makeStyles);
  const t = useTranslation();
  const language = useLanguage();
  const [focused, setFocused] = useState(false);

  const date =
    item.type === 'header'
      ? formatShortDate(item.story.publishedAt, language)
      : '';

  const renderContent = () => {
    if (item.type === 'header') {
      return <ArticleHeader story={item.story} date={date} width={width} />;
    }
    if (item.block.kind === 'image') {
      return <ImageBlock block={item.block} width={width} />;
    }
    return <TextBlock block={item.block} />;
  };

  return (
    <Pressable
      onFocus={() => {
        setFocused(true);
        onFocusItem(index);
      }}
      onBlur={() => setFocused(false)}
      hasTVPreferredFocus={hasTVPreferredFocus}
      {...preferredFocusProps(hasTVPreferredFocus)}
      accessible
      accessibilityRole={
        item.type === 'header'
          ? 'header'
          : item.block.kind === 'image'
          ? 'image'
          : 'text'
      }
      accessibilityLabel={labelOf(item, date, t)}
      style={[styles.item, focused && styles.focused]}
    >
      {renderContent()}
    </Pressable>
  );
}

export const BodyItem = memo(BodyItemView);
