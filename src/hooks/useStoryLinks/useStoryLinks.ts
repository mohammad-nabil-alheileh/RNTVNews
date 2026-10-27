import { useCallback, useEffect, useRef } from 'react';
import { getInitialLink, onLink } from '../../platform/launchLinks/launchLinks';
import { parseStoryLink } from '../../utils/parseStoryLink/parseStoryLink';

export function useStoryLinks(open: (storyId: number) => void): () => void {
  const ready = useRef(false);
  const pending = useRef<number | null>(null);
  const latestOpen = useRef(open);

  useEffect(() => {
    latestOpen.current = open;
  });

  const handle = useCallback((url: string | null) => {
    const storyId = parseStoryLink(url);
    if (storyId === null) {
      return;
    }
    if (ready.current) {
      latestOpen.current(storyId);
    } else {
      pending.current = storyId;
    }
  }, []);

  useEffect(() => {
    let active = true;
    getInitialLink().then(url => {
      if (active) {
        handle(url);
      }
    });
    const stop = onLink(handle);
    return () => {
      active = false;
      stop();
    };
  }, [handle]);

  return useCallback(() => {
    ready.current = true;
    if (pending.current !== null) {
      latestOpen.current(pending.current);
      pending.current = null;
    }
  }, []);
}
