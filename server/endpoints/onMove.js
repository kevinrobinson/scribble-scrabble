import {gameDocAfterMove} from '../../shared/scribbleScrabble';
import {updateGameDoc} from '../queries';


export default async function onMove(req, res) {
  const {playerKey} = req.session;
  const {gameKey} = req.params;
  const {move} = req.body;
  
  updateGameDoc(gameKey, doc => gameDocAfterMove(doc, playerKey, move));
  res.status(200).json({});
}
