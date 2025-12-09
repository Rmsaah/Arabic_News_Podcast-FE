// Ensure the base API URL is well-formed regardless of how API_URL is provided at runtime.
// Rules:
// - If no path is present, append "/api".
// - If path is exactly "/api" or "/api/", keep it (remove trailing slash).
// - Otherwise (e.g., "/api/v1"), keep provided path.
// - Never end with a trailing slash.
function normalizeApiUrl(url: string | undefined | null, fallback: string): string {
  const raw = (url ?? '').toString().trim();
  const base = raw.length > 0 ? raw : fallback;

  const stripTrailing = (s: string) => s.replace(/\/+$/, '');

  // Extract path part, if any
  const m = base.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^\/]+(\/.*)?$/);
  const path = m && m[1] ? m[1] : '';

  if (path === '' || path === '/') {
    return `${stripTrailing(base)}/api`;
  }

  if (path === '/api' || path === '/api/') {
    return stripTrailing(base);
  }

  return stripTrailing(base);
}

const runtimeApiUrl = (typeof window !== 'undefined' && (window as any).__env && (window as any).__env.API_URL)
  ? (window as any).__env.API_URL
  : undefined;

export const environment = {
  production: true,
  // Prefer runtime-provided API_URL from env.js; fallback to default for production
  apiUrl: normalizeApiUrl(runtimeApiUrl, 'http://localhost:8283/api')
};
