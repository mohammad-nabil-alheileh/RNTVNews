import { Story } from '../types/story';

interface RowMemory {
  stories: Story[];
  focusedId: number;
}

const memory = new Map<string, RowMemory>();

export function getRowMemory(tag: string): RowMemory | undefined {
  return memory.get(tag);
}

export function setRowMemory(tag: string, value: RowMemory) {
  memory.set(tag, value);
}

export function clearRowMemory() {
  memory.clear();
}
