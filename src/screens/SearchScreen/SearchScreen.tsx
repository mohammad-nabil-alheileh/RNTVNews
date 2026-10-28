import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { SearchKeyboard } from '../../components/SearchKeyboard/SearchKeyboard';
import { SearchResults } from '../../components/SearchResults/SearchResults';
import { MainLayout } from '../../components/shared/MainLayout/MainLayout';
import { StatusView } from '../../components/shared/StatusView/StatusView';
import { useSearch } from '../../hooks/useSearch/useSearch';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import { autoDirection } from '../../platform/textDirection/textDirection';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { ScreenProps } from '../../types/navigation';
import { Story } from '../../types/story';
import { makeStyles } from './SearchScreen.styles';

const MAX_QUERY_LENGTH = 40;

export function SearchScreen({ navigation, route }: ScreenProps<'Search'>) {
  const styles = useStyles(makeStyles);
  const t = useTranslation();
  const [query, setQuery] = useState(
    () => route.params?.query?.slice(0, MAX_QUERY_LENGTH) ?? '',
  );
  const search = useSearch(query);

  const type = useCallback(
    (text: string) =>
      setQuery(current =>
        (current + text).replace(/^\s+/, '').slice(0, MAX_QUERY_LENGTH),
      ),
    [],
  );
  const remove = useCallback(
    () => setQuery(current => current.slice(0, -1)),
    [],
  );
  const clear = useCallback(() => setQuery(''), []);

  const openStory = useCallback(
    (story: Story, list: Story[]) =>
      navigation.navigate('Article', {
        storyId: story.id,
        queue: list.map(item => item.id),
      }),
    [navigation],
  );

  const summary = () => {
    if (!search.query) {
      return t('searchHint');
    }
    const count = search.results.length;
    const found =
      count === 0
        ? t('noResults')
        : count === 1
        ? t('storyFor', { query: search.query })
        : t('storiesFor', { count, query: search.query });
    if (search.fetching) {
      return t('gettingNewStories', { found });
    }
    if (search.offline) {
      return t('offlineNote', { found });
    }
    return found;
  };

  const renderResults = () => {
    if (!search.query) {
      return null;
    }
    if (search.results.length > 0) {
      return <SearchResults stories={search.results} onOpen={openStory} />;
    }
    if (search.fetching) {
      return (
        <StatusView
          kind="loading"
          title={t('lookingFor', { query: search.query })}
          actionLabel={t('clearSearch')}
          onAction={clear}
        />
      );
    }
    if (search.offline) {
      return (
        <StatusView
          kind="offline"
          title={t('noConnection')}
          message={t('offlineNoMatch', { query: search.query })}
          actionLabel={t('clearSearch')}
          onAction={clear}
        />
      );
    }
    return (
      <StatusView
        kind="empty"
        title={t('noMatch', { query: search.query })}
        message={t('noMatchHint')}
        actionLabel={t('clearSearch')}
        onAction={clear}
      />
    );
  };

  return (
    <MainLayout current="Search">
      <View style={styles.screen}>
        <View style={styles.left}>
          <View style={styles.queryBox}>
            {query ? (
              <Text {...autoDirection} numberOfLines={1} style={styles.query}>
                {query}
              </Text>
            ) : (
              <Text style={styles.placeholder}>{t('typeWithKeyboard')}</Text>
            )}
          </View>
          <SearchKeyboard onType={type} onDelete={remove} onClear={clear} />
        </View>
        <View style={styles.right}>
          <Text
            accessibilityLiveRegion="polite"
            numberOfLines={1}
            style={styles.summary}
          >
            {summary()}
          </Text>
          <View style={styles.results}>{renderResults()}</View>
        </View>
      </View>
    </MainLayout>
  );
}
