function normalizeApiUrl(rawUrl: string) {
  const trimmed = rawUrl.trim().replace(/\/+$/, '');

  if (trimmed.endsWith('/api')) {
    return trimmed;
  }

  return `${trimmed}/api`;
}

export function getApiUrl() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';
  return normalizeApiUrl(base);
}
