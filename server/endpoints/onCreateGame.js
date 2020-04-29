import {getPool} from '../db';
import {newGame} from '../../shared/scribbleScrabble';
import {queryGameForPlayer} from './onGameKey';


export default async function onCreateGame(req, res) {
  const {playerKey} = req.session;
  const {key, doc, timestamp} = newGame(playerKey);
  const sql = `INSERT INTO games(key, doc, timestampz) VALUES ($1, $2, $3)`;
  const values = [key, doc, timestamp];
  await getPool().query(sql, values);

  // mirror get query
  const gameForPlayer = await queryGameForPlayer(key, playerKey);
  res.status(200).json(gameForPlayer);
}


