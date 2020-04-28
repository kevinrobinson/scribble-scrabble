import {getPool} from '../../../server/db';
import {runMiddleware, enforceHTTPS} from '../../../server/middleware';
import {createGame} from '../../../components/fns';

export default async function(req, res) {
  await runMiddleware(req, res, enforceHTTPS);

  const playerId = 9999999;
  const {key, doc, timestamp} = createGame(playerId);
  const sql = `INSERT INTO games(key, doc, timestampz) VALUES ($1, $2, $3)`;
  const values = [key, doc, timestamp];
  await getPool().query(sql, values);

  res.status(200).json({
    playerId,
    key,
    doc,
    timestamp
  });
}


