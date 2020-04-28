export function reloadAsHTTPSInProduction() {
  const isProduction = (process.env.NODE_ENV === 'production');
  const isHTTPS = (window.location.protocol === 'https:');
  if (isProduction && !isHTTPS) {
    window.location = window.location.href.replace(/^http:\/\//, 'https://');
  }
}