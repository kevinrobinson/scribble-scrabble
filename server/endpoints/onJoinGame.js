import _ from 'lodash';
import {withinTransaction} from '../db';
import {gameDocAfterJoining} from '../../shared/scribbleScrabble';
import {queryGameRecord} from '../queries';


// should transaction
export default async function onJoinGame(req, res) {
  const {gameKey} = req.params;
  const {playerKey} = req.session;
  
  withinTransaction(async client => {
    const {doc} = await queryGameRecord(gameKey, {client});
    const updatedDoc = gameDocAfterJoining(doc, playerKey);
    if (!_.isEqual(updatedDoc, doc)) {
      const sql = 'UPDATE games SET doc = $1 WHERE key = $2';
      await client.query(sql, [updatedDoc, gameKey]);
    }
  });

  res.status(200).json({});
}
