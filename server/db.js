import getConfig from 'next/config'
import {Pool} from 'pg';


// For querying the database
export function createPool() {
  const {DATABASE_URL, NODE_ENV} = getConfig().serverRuntimeConfig;
  const connectionString = DATABASE_URL;
  return new Pool({
    connectionString: DATABASE_URL,
    ssl: (NODE_ENV === 'production')
  });
}

let pool = null;
export function getPool() {
  if (pool === null) {
    pool = createPool();
  }
  return pool;
}