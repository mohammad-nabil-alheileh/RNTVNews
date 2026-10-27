import { TranslationKey } from '../../../../../i18n/en';
import { MainSection } from '../../MainLayout.types';

export interface NavItem {
  section: MainSection;
  labelKey: TranslationKey;
}

export interface NavBarProps {
  current: MainSection;
}
