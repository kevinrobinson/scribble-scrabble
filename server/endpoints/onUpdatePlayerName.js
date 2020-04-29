import {v4 as uuidv4} from 'uuid';
import {getPool} from '../db';
import {newGame} from '../../shared/scribbleScrabble';


export default async function onUpdatePlayerName(req, res) {
  const {name} = req.body;
  const uid = `u:${uuidv4()}`;
  const timestamp = new Date();
  const sql = `INSERT INTO players(fbuid, name, timestampz) VALUES ($1, $2, $3)`;
  const values = [uid, name, timestamp];
  await getPool().query(sql, values);
  
  req.session.uid = uid;
  res.status(200).json({name});
}


