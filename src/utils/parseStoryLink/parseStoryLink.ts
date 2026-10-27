const STORY_LINK = /^tvnewsreader:\/\/story\/(\d+)\/?(?:[?#].*)?$/i;

export function parseStoryLink(url: string | null | undefined): number | null {
  const match = url?.trim().match(STORY_LINK);
  if (!match) {
    return null;
  }
  const id = Number(match[1]);
  return id > 0 && Number.isSafeInteger(id) ? id : null;
}

export function storyLink(id: number): string {
  return `tvnewsreader://story/${id}`;
}
