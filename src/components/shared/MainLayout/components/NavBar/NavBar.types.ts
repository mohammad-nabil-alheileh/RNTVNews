import { Language } from '../../../../../types/language';
import { MainSection } from '../../MainLayout.types';

export interface NavItem {
  section: MainSection;
  label: Record<Language, string>;
}

export interface NavBarProps {
  current: MainSection;
}
