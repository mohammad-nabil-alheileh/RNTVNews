export interface ArticleActionsProps {
  onBack: () => void;
  onSave: () => void;
  onNext: () => void;
  saved: boolean;
  canSave: boolean;
  hasNext: boolean;
}
