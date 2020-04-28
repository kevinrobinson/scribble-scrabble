import getConfig from 'next/config'
import {runMiddleware, enforceHTTPS} from '../../../middleware/middleware';

export default async function(req, res) {
  await runMiddleware(enforceHTTPS);

  const {PORT} = getConfig().serverRuntimeConfig;
  console.log('PORT', PORT);
  const {gameId} = req.query;
  res.status(200).json({
    gameId,
    text: 'Hello'
  });
}
