import cookieSession from 'cookie-session';
import {v4 as uuidv4} from 'uuid';
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

// write to the session cookie, and write a record
// separately, they can set the name of their own
export async function enforceUserId(req, res, next) {
  if (!req.session.uid) {
    const uid = `u:${uuidv4()}`;
    const timestamp = new Date();
    const sql = `INSERT INTO players(fbuid, timestampz) VALUES ($1, $2)`;
    const values = [uid, timestamp];
    await getPool().query(sql, values);
    req.session.uid = uid;
  }

  next();
}