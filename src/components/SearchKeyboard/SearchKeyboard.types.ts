export type KeyboardLayout = 'en' | 'ar';

export interface SearchKeyboardProps {
  onType: (text: string) => void;
  onDelete: () => void;
  onClear: () => void;
}
