import { Story } from '../../types/story';

export interface SearchState {
  query: string;
  results: Story[];
  fetching: boolean;
  offline: boolean;
}
