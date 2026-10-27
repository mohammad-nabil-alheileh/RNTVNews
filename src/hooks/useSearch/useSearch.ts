import { useEffect, useState } from 'react';
import { refreshForQuery, searchStories } from '../../api/search';
import { SearchState } from './useSearch.types';

const DEBOUNCE_MS = 1000;
const EMPTY: SearchState = {
  query: '',
  results: [],
  fetching: false,
  offline: false,
};

export function useSearch(query: string): SearchState {
  const [state, setState] = useState<SearchState>(EMPTY);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setState(EMPTY);
      return;
    }

    let active = true;
    const timer = setTimeout(() => {
      setState({
        query: trimmed,
        results: searchStories(trimmed),
        fetching: true,
        offline: false,
      });
      refreshForQuery(trimmed).then(online => {
        if (active) {
          setState({
            query: trimmed,
            results: searchStories(trimmed),
            fetching: false,
            offline: !online,
          });
        }
      });
    }, DEBOUNCE_MS);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  return state;
}
