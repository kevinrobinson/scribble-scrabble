import {getPool} from '../db';
import {newGame} from '../../shared/scribbleScrabble';


export default async function onUpdatePlayerName(req, res) {
  const {name} = req.body;
  const {uid} = req.session;
  const sql = 'UPDATE players SET name=$1 WHERE fbuid = $2';
  console.log('sql', sql);
  const values = [name, uid];
  await getPool().query(sql, values);
  res.status(200).json({name});
}


