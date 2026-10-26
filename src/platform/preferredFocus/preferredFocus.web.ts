export function preferredFocusProps(preferred?: boolean): object {
  return preferred ? { dataSet: { preferredFocus: 'true' } } : {};
}
