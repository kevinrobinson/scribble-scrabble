import {getPool} from '../db';

export default async function onGameKey(req, res) {
  const {gameKey} = req.params;
  const {playerKey} = req.session;
  const gameForPlayer = await queryGameForPlayer(gameKey, playerKey);
  res.status(200).json(gameForPlayer);
}


export async function queryGameForPlayer(gameKey, playerKey) {
  const {doc} = await queryGameRecord(gameKey);
  const players = await queryPlayerRecords(doc.orderedPlayerKeys);
  return {
    gameKey,
    playerKey,
    players,
    version: doc.version,
    createdAt: doc.createdAt,
    orderedPlayerKeys: doc.orderedPlayerKeys,
    letters: doc.lettersForPlayers[playerKey],
    tiles: doc.tiles,
    moves: doc.moves
  };
}

async function queryGameRecord(gameKey) {
  const sql = 'SELECT key, doc FROM games WHERE key = $1 LIMIT 1;';
  const response = await getPool().query(sql, [gameKey]);
  if (response.rows.length === 0) {
    throw new Error(`404: gameKey not found: ${gameKey}`);
  }
  return response.rows[0];
}

// This should be a "where in" query.
async function queryPlayerRecords(orderedPlayerKeys) {
  const sql = 'SELECT fbuid, name FROM players';
  const response = await getPool().query(sql);
  return response.rows.filter(row => orderedPlayerKeys.indexOf(row.fbuid) !== -1);
}

