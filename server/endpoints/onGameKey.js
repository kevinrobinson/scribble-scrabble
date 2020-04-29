import {queryGameForPlayer} from '../queries';


export default async function onGameKey(req, res) {
  const {gameKey} = req.params;
  const {playerKey} = req.session;
  const gameForPlayer = await queryGameForPlayer(gameKey, playerKey);
  res.status(200).json(gameForPlayer);
}
