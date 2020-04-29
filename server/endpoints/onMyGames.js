import _ from 'lodash';
import {getPool} from '../db';
import {queryPlayers} from '../queries';
import {gameForClient} from '../../shared/scribbleScrabble';


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
  const gameRecords = response.rows;

  // manual join (avoiding n+1), then map to client-facing shape
  const allPlayerKeys = _.uniq(_.flatMap(gameRecords, record => record.doc.orderedPlayerKeys));
  const allPlayers = await queryPlayers(allPlayerKeys);
  const gamesList = gameRecords.map(gameRecord => {
    const {key, doc} = gameRecord;
    const players = allPlayers.filter(({playerKey}) => doc.orderedPlayerKeys.indexOf(playerKey) !== 1);
    return gameForClient(key, playerKey, players, doc);
  });
  res.status(200).json({
    playerKey,
    games: gamesList
  });
}
