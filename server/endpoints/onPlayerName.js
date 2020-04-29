import {getPool} from '../db';


export default async function onPlayerName(req, res) {
  const {playerKey} = req.session;
  const response = await getPool().query(`SELECT name FROM players WHERE fbuid = $1 LIMIT 1;`, [playerKey]);
  if (response.rows.length === 0) {
    console.log(`404: playerKey not found: ${playerKey}`);
    return res.status(404).json({});
  }

  const {name} = response.rows[0];
  res.status(200).json({name});
}
