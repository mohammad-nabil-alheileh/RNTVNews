import { storyLink } from '../../utils/parseStoryLink/parseStoryLink';

interface LaunchParams {
  target?: unknown;
  contentTarget?: unknown;
  storyId?: unknown;
}

interface WebOsSystem {
  launchParams?: string;
  activate?: () => void;
}

function webOsSystem(): WebOsSystem | undefined {
  const scope = window as unknown as {
    webOSSystem?: WebOsSystem;
    PalmSystem?: WebOsSystem;
  };
  return scope.webOSSystem ?? scope.PalmSystem;
}

function linkFromParams(params: unknown): string | null {
  if (typeof params === 'string') {
    try {
      return linkFromParams(JSON.parse(params));
    } catch {
      return null;
    }
  }
  if (!params || typeof params !== 'object') {
    return null;
  }
  const { target, contentTarget, storyId } = params as LaunchParams;
  const link = target ?? contentTarget;
  if (typeof link === 'string') {
    return link;
  }
  if (typeof storyId === 'number' || typeof storyId === 'string') {
    return storyLink(Number(storyId));
  }
  return null;
}

function linkFromAddress(): string | null {
  const story = new URLSearchParams(window.location.search).get('story');
  return story ? storyLink(Number(story)) : null;
}

export function getInitialLink(): Promise<string | null> {
  return Promise.resolve(
    linkFromParams(webOsSystem()?.launchParams) ?? linkFromAddress(),
  );
}

export function onLink(listener: (url: string) => void): () => void {
  const handleRelaunch = (event: Event) => {
    const system = webOsSystem();
    system?.activate?.();
    const link =
      linkFromParams((event as CustomEvent).detail) ??
      linkFromParams(system?.launchParams);
    if (link) {
      listener(link);
    }
  };
  document.addEventListener('webOSRelaunch', handleRelaunch);
  return () => document.removeEventListener('webOSRelaunch', handleRelaunch);
}
