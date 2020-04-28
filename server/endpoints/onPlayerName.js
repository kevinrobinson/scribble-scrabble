import {getPool} from '../db';


export default async function onPlayerName(req, res) {
  const {uid} = req.session;
  const response = await getPool().query(`SELECT name FROM players WHERE fbuid = $1 LIMIT 1;`, [uid]);
  if (response.rows.length === 0) {
    console.log(`404: player not found: ${uid}`);
    return res.status(404).json({});
  }

  const {name} = response.rows[0];
  res.status(200).json({name});
}
