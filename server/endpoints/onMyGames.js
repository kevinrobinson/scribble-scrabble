import {getPool} from '../db';


export default async function onMyGames(req, res) {
  const {playerKey} = req.session;
  const sql = `
    SELECT key, doc
    FROM games
    WHERE (doc -> 'orderedPlayerKeys')::jsonb ? $1
    ORDER BY timestampz DESC
    LIMIT 20;`;
  const values = [playerKey];
  const response = await getPool().query(sql, values);
  res.status(200).json({
    games: response.rows
  });
}
