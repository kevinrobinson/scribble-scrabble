import cookieSession from 'cookie-session';
import {getPool} from './db';


// https redirect
export function enforceHTTPS(request, response, next) {
  const isProduction = (process.env.NODE_ENV === 'production');
  const isHTTPS = (request.headers['x-forwarded-proto'] === 'https');
  if (isProduction && !isHTTPS) {
    console.log('Redirected to HTTPS.');
    const httpsUrl = ['https://', request.headers.host, request.url].join('');
    return response.redirect(httpsUrl);  
  }

  return next();
}

// configure session cookie
export function configuredCookieSession() {
  return cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET_KEY],
    httpOnly: true,
    signed: true
  });
}
