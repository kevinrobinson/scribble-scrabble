import getConfig from 'next/config'
import {Pool} from 'pg';


// For querying the database
function createPool() {
  const {DATABASE_URL, NODE_ENV} = getConfig().serverRuntimeConfig;
  return new Pool({
    connectionString: DATABASE_URL,
    ssl: (NODE_ENV === 'production')
  });
}

// singleton
let pool = null;
export function getPool() {
  if (pool === null) {
    pool = createPool();
  }
  return pool;
}

// See https://node-postgres.com/features/transactions
export async function withinTransaction(fn) {
  const pool = getPool();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const returnValue = await fn(client);
    await client.query('COMMIT');
    return returnValue;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release()
  }
}