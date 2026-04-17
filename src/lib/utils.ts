export function normalizeOptionText(text: string) {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}
