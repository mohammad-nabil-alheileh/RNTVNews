import { ReactNode } from 'react';

export type MainSection = 'Home' | 'Category' | 'Search' | 'Saved' | 'Settings';

export interface MainLayoutProps {
  current: MainSection;
  children: ReactNode;
}
