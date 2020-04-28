import {getPool} from '../db';
import {newGame} from '../../shared/scribbleScrabble';


export default async function onCreateGame(req, res) {
  const playerId = req.session.uid;
  const {key, doc, timestamp} = newGame(playerId);
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


