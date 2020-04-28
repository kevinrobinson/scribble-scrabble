import getConfig from 'next/config'
import {Pool} from 'pg';


// For querying the database
export function createPool() {
  const {DATABASE_URL, NODE_ENV} = getConfig().serverRuntimeConfig;
  // const connectionString = (NODE_ENV === 'development')
  //   ? DATABASE_URL
  //   : DATABASE_URL +'?ssl=true';
  const connectionString = DATABASE_URL;
  return new Pool({connectionString});
}

let pool = null;
export function getPool() {
  if (pool === null) {
    pool = createPool();
  }
  return pool;
}