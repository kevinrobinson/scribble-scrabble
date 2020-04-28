export default (req, res) => {
  console.log('ooooooooh');
  const {gameId} = req.query;
  res.status(200).json({
    gameId,
    text: 'Hello'
  });
}
