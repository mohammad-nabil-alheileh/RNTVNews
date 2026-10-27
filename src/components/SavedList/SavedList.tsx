import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useCenteredList } from '../../hooks/useCenteredList/useCenteredList';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { SavedArticle } from '../../types/saved';
import { MeasuredCell } from '../shared/MeasuredCell/MeasuredCell';
import { MeasuredCellContext } from '../shared/MeasuredCell/MeasuredCell.context';
import { FocusGroup } from '../shared/FocusGroup/FocusGroup';
import { SavedItem } from './components/SavedItem/SavedItem';
import { makeStyles } from './SavedList.styles';
import { SavedListProps } from './SavedList.types';

const keyOf = (item: SavedArticle) => String(item.article.id);

export function SavedList({
  items,
  preferredIndex,
  onOpen,
  onRemove,
}: SavedListProps) {
  const styles = useStyles(makeStyles);
  const { listRef, onLayout, recordCell, centerOn } =
    useCenteredList<SavedArticle>();

  const renderItem = useCallback<ListRenderItem<SavedArticle>>(
    ({ item, index }) => (
      <SavedItem
        article={item.article}
        index={index}
        onOpen={onOpen}
        onRemove={onRemove}
        onFocusRow={centerOn}
        hasTVPreferredFocus={index === preferredIndex}
      />
    ),
    [onOpen, onRemove, centerOn, preferredIndex],
  );

  return (
    <FocusGroup remember trap={['down']} style={styles.group}>
      <MeasuredCellContext.Provider value={recordCell}>
        <FlatList
          ref={listRef}
          onLayout={onLayout}
          data={items}
          keyExtractor={keyOf}
          renderItem={renderItem}
          CellRendererComponent={MeasuredCell}
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
