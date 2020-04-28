import getConfig from 'next/config'

export default (req, res) => {
  const {PORT} = getConfig().serverRuntimeConfig;
  console.log('PORT', PORT);
  const {gameId} = req.query;
  res.status(200).json({
    gameId,
    text: 'Hello'
  });
}
