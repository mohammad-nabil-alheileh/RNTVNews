import React, { memo, useState } from 'react';
import { Pressable } from 'react-native';
import { formatShortDate } from '../../../../i18n/formatDate';
import { useLanguage } from '../../../../i18n/language';
import { preferredFocusProps } from '../../../../platform/preferredFocus/preferredFocus';
import { useStyles } from '../../../../theme/theme';
import { ArticleBodyItem } from '../../ArticleBody.types';
import { makeStyles } from './BodyItem.styles';
import { BodyItemProps } from './BodyItem.types';
import { ArticleHeader } from './components/ArticleHeader/ArticleHeader';
import { ImageBlock } from './components/ImageBlock/ImageBlock';
import { TextBlock } from './components/TextBlock/TextBlock';

function labelOf(item: ArticleBodyItem, date: string): string {
  if (item.type === 'header') {
    const { title, author, readingMinutes } = item.story;
    return `${title}, ${author}, ${date}, ${readingMinutes} min read`;
  }
  if (item.block.kind === 'image') {
    return item.block.alt || 'Image';
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
      accessibilityLabel={labelOf(item, date)}
      style={[styles.item, focused && styles.focused]}
    >
      {renderContent()}
    </Pressable>
  );
}

export const BodyItem = memo(BodyItemView);
