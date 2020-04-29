import {v4 as uuidv4} from 'uuid';
import {getPool} from '../db';


export default async function onUpdatePlayerName(req, res) {
  const {name} = req.body;
  const playerKey = `p:${uuidv4()}`;
  const timestamp = new Date();
  const sql = `INSERT INTO players(fbuid, name, timestampz) VALUES ($1, $2, $3)`;
  const values = [playerKey, name, timestamp];
  await getPool().query(sql, values);
  
  req.session.playerKey = playerKey;
  res.status(200).json({name});
}


