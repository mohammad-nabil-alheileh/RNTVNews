import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useCenteredList } from '../../hooks/useCenteredList/useCenteredList';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { MeasuredCell } from '../shared/MeasuredCell/MeasuredCell';
import { MeasuredCellContext } from '../shared/MeasuredCell/MeasuredCell.context';
import { FocusGroup } from '../shared/FocusGroup/FocusGroup';
import { StatusView } from '../shared/StatusView/StatusView';
import { bodyContentWidth, makeStyles } from './ArticleBody.styles';
import { ArticleBodyItem, ArticleBodyProps } from './ArticleBody.types';
import { BodyItem } from './components/BodyItem/BodyItem';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';

const keyOf = (item: ArticleBodyItem, index: number) =>
  item.type === 'header' ? 'header' : `block-${index}`;

export function ArticleBody({
  story,
  state,
  onRetry,
  onBack,
}: ArticleBodyProps) {
  const t = useTranslation();
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const width = bodyContentWidth(theme);
  const { listRef, onLayout, recordCell, centerOn } =
    useCenteredList<ArticleBodyItem>();

  const items = useMemo<ArticleBodyItem[]>(() => {
    const header: ArticleBodyItem[] = story ? [{ type: 'header', story }] : [];
    if (state.status !== 'success') {
      return header;
    }
    return header.concat(
      state.data.blocks.map(block => ({ type: 'block' as const, block })),
    );
  }, [story, state]);

  const renderItem = useCallback<ListRenderItem<ArticleBodyItem>>(
    ({ item, index }) => (
      <BodyItem
        item={item}
        index={index}
        width={width}
        onFocusItem={centerOn}
        hasTVPreferredFocus={item.type === 'header'}
      />
    ),
    [width, centerOn],
  );

  const renderStatus = () => {
    const preferred = !story;
    switch (state.status) {
      case 'loading':
        return (
          <StatusView
            kind="loading"
            title={t('loadingArticle')}
            actionLabel={t('back')}
            onAction={onBack}
            hasTVPreferredFocus={preferred}
            style={styles.status}
          />
        );
      case 'offline':
        return (
          <StatusView
            kind="offline"
            title={t('noConnection')}
            message={t('checkNetwork')}
            actionLabel={t('retry')}
            onAction={onRetry}
            hasTVPreferredFocus={preferred}
            style={styles.status}
          />
        );
      case 'error':
        return (
          <StatusView
            kind="error"
            title={t('couldntLoadStory')}
            message={state.error}
            actionLabel={t('retry')}
            onAction={onRetry}
            hasTVPreferredFocus={preferred}
            style={styles.status}
          />
        );
      case 'success':
        if (state.data.blocks.length > 0) {
          return null;
        }
        return (
          <StatusView
            kind="empty"
            title={t('storyHasNoText')}
            actionLabel={t('back')}
            onAction={onBack}
            style={styles.status}
          />
        );
    }
  };

  return (
    <FocusGroup remember trap={['right', 'up', 'down']} style={styles.group}>
      <MeasuredCellContext.Provider value={recordCell}>
        <FlatList
          ref={listRef}
          onLayout={onLayout}
          data={items}
          keyExtractor={keyOf}
          renderItem={renderItem}
          CellRendererComponent={MeasuredCell}
          ListFooterComponent={renderStatus()}
          initialNumToRender={6}
          maxToRenderPerBatch={4}
          windowSize={5}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          contentContainerStyle={styles.content}
        />
      </MeasuredCellContext.Provider>
    </FocusGroup>
  );
}
