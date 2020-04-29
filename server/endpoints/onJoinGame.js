import {gameDocAfterJoining} from '../../shared/scribbleScrabble';
import {updateGameDoc} from '../queries';


export default async function onJoinGame(req, res) {
  const {gameKey} = req.params;
  const {playerKey} = req.session;  
  await updateGameDoc(gameKey, doc => gameDocAfterJoining(doc, playerKey));
  res.status(200).json({});
}
