import {getPool} from '../db';


export default async function onGameKey(req, res) {
  const {gameKey} = req.params;
  const response = await getPool().query(`SELECT key, doc FROM games WHERE key = $1 LIMIT 1;`, [gameKey]);
  if (response.rows.length === 0) {
    console.log(`404: gameKey not found: ${gameKey}`);
    return res.status(404).json({});
  }

  const game = response.rows[0];
  res.status(200).json(game);
}
