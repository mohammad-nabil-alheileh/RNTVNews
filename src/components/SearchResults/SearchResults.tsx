import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useCenteredList } from '../../hooks/useCenteredList/useCenteredList';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { Story } from '../../types/story';
import { MeasuredCell } from '../shared/MeasuredCell/MeasuredCell';
import { MeasuredCellContext } from '../shared/MeasuredCell/MeasuredCell.context';
import { FocusGroup } from '../shared/FocusGroup/FocusGroup';
import { StoryRow } from '../shared/StoryRow/StoryRow';
import { makeStyles } from './SearchResults.styles';
import { SearchResultsProps } from './SearchResults.types';

const keyOf = (story: Story) => String(story.id);

export function SearchResults({ stories, onOpen }: SearchResultsProps) {
  const styles = useStyles(makeStyles);
  const { listRef, onLayout, recordCell, centerOn } = useCenteredList<Story>();

  const open = useCallback(
    (story: Story) => onOpen(story, stories),
    [onOpen, stories],
  );

  const renderItem = useCallback<ListRenderItem<Story>>(
    ({ item, index }) => (
      <StoryRow
        story={item}
        onPress={open}
        onFocus={() => centerOn(index)}
        style={styles.item}
      />
    ),
    [open, centerOn, styles.item],
  );

  return (
    <FocusGroup remember trap={['right', 'down']} style={styles.group}>
      <MeasuredCellContext.Provider value={recordCell}>
        <FlatList
          ref={listRef}
          onLayout={onLayout}
          data={stories}
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
