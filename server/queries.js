import _ from 'lodash';
import {getPool, withinTransaction} from './db';
import {NotFoundError} from './errors';
import {gameForClient} from '../shared/scribbleScrabble';


export async function updateGameDoc(gameKey, updateDocFn) {
  return withinTransaction(async client => {
    const {doc} = await queryGameRecord(gameKey, {client});
    const updatedDoc = updateDocFn(doc);
    if (!_.isEqual(updatedDoc, doc)) {
      const sql = 'UPDATE games SET doc = $1 WHERE key = $2';
      await client.query(sql, [updatedDoc, gameKey]);
    }
  });
}

// Player may not have joined (but game is public if you have the key)
export async function queryGameForPlayer(gameKey, playerKey) {
  const {doc} = await queryGameRecord(gameKey);
  const players = await queryPlayers(doc.orderedPlayerKeys);
  return gameForClient(gameKey, playerKey, players, doc);
}


export async function queryGameRecord(gameKey, options = {}) {
  const client = options.client || getPool();
  const sql = 'SELECT key, doc FROM games WHERE key = $1 LIMIT 1;';
  const response = await client.query(sql, [gameKey]);
  if (response.rows.length === 0) {
    throw new NotFoundError(`gameKey not found: ${gameKey}`);
  }
  return response.rows[0];
}

// This should be a "where in" query.  Avoid exposing fbuid, should migrate.
export async function queryPlayers(playerKeys) {
  const sql = 'SELECT fbuid, name FROM players';
  const response = await getPool().query(sql);
  return playersForGameDoc(playerKeys, response.rows);
}

function playersForGameDoc(playerKeys, allPlayerRecords) {
  const matches = allPlayerRecords.filter(row => playerKeys.indexOf(row.fbuid) !== -1);
  return matches.map(row => {
    return {
      playerKey: row.fbuid,
      name: row.name
    };
  });
}