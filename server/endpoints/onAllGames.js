import {getPool} from '../db';


export default async function onAllGames(req, res) {
  const {gameKey} = req.params;
  const response = await getPool().query(`SELECT key, doc FROM games ORDER BY timestampz DESC LIMIT 20`);
  res.status(200).json({
    games: response.rows
  });
}
