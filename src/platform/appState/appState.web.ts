export function onAppResume(listener: (awayMs: number) => void): () => void {
  let leftAt: number | null = document.hidden ? Date.now() : null;
  const handleChange = () => {
    if (document.hidden) {
      leftAt ??= Date.now();
    } else if (leftAt !== null) {
      listener(Date.now() - leftAt);
      leftAt = null;
    }
  };
  document.addEventListener('visibilitychange', handleChange);
  return () => document.removeEventListener('visibilitychange', handleChange);
}
