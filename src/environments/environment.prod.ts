export const environment = {
  production: true,
  // Prefer runtime-provided API_URL from env.js; fallback to default for production
  apiUrl: (typeof window !== 'undefined' && (window as any).__env && (window as any).__env.API_URL)
    ? (window as any).__env.API_URL
    : 'http://localhost:8283/api'
};
