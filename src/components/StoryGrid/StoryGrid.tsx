import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useCenteredList } from '../../hooks/useCenteredList/useCenteredList';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { Story } from '../../types/story';
import { MeasuredCell } from '../shared/MeasuredCell/MeasuredCell';
import { MeasuredCellContext } from '../shared/MeasuredCell/MeasuredCell.context';
import { FocusGroup } from '../shared/FocusGroup/FocusGroup';
import { StoryCard } from '../shared/StoryCard/StoryCard';
import { COLUMNS, GRID_CARD_WIDTH, makeStyles } from './StoryGrid.styles';
import { StoryGridProps } from './StoryGrid.types';

const keyOf = (story: Story) => String(story.id);

export function StoryGrid({ stories, onOpen, onFocusStory }: StoryGridProps) {
  const styles = useStyles(makeStyles);
  const { listRef, onLayout, recordCell, centerOn } = useCenteredList<Story>();

  const open = useCallback(
    (story: Story) => onOpen(story, stories),
    [onOpen, stories],
  );

  const renderItem = useCallback<ListRenderItem<Story>>(
    ({ item, index }) => (
      <StoryCard
        story={item}
        width={GRID_CARD_WIDTH}
        onPress={open}
        onFocus={() => {
          centerOn(Math.floor(index / COLUMNS));
          onFocusStory();
        }}
      />
    ),
    [open, centerOn, onFocusStory],
  );

  return (
    <FocusGroup remember trap={['left', 'right', 'down']} style={styles.group}>
      <MeasuredCellContext.Provider value={recordCell}>
        <FlatList
          ref={listRef}
          onLayout={onLayout}
          data={stories}
          keyExtractor={keyOf}
          renderItem={renderItem}
          numColumns={COLUMNS}
          CellRendererComponent={MeasuredCell}
          columnWrapperStyle={styles.row}
          initialNumToRender={8}
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
