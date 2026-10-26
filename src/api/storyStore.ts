import { Story } from '../types/story';

const stories = new Map<number, Story>();

export function addStories(list: Story[]): void {
  for (const story of list) {
    stories.set(story.id, story);
  }
}

export function getStory(id: number): Story | undefined {
  return stories.get(id);
}

export function getAllStories(): Story[] {
  return Array.from(stories.values());
}
