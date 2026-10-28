import { useCallback, useEffect, useRef } from 'react';
import { fetchArticleByPath } from '../../api/devto';
import { getInitialLink, onLink } from '../../platform/launchLinks/launchLinks';
import { AppLink, ParsedLink } from '../../types/appLink';
import { parseAppLink } from '../../utils/parseAppLink/parseAppLink';

async function resolve(link: ParsedLink): Promise<AppLink | null> {
  if (link.screen !== 'DevtoArticle') {
    return link;
  }
  try {
    const article = await fetchArticleByPath(link.path);
    return { screen: 'Article', storyId: article.id };
  } catch {
    return null;
  }
}

export function useAppLinks(open: (link: AppLink) => void): () => void {
  const ready = useRef(false);
  const pending = useRef<AppLink | null>(null);
  const latestOpen = useRef(open);
  const latestLink = useRef(0);

  useEffect(() => {
    latestOpen.current = open;
  });

  const handle = useCallback(async (url: string | null) => {
    const parsed = parseAppLink(url);
    if (!parsed) {
      return;
    }
    const ticket = ++latestLink.current;
    const link = await resolve(parsed);
    if (!link || ticket !== latestLink.current) {
      return;
    }
    if (ready.current) {
      latestOpen.current(link);
    } else {
      pending.current = link;
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
