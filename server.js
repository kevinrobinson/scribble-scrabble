const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();
app.prepare().then(configure);


function configure() {
  const server = express()

  server.get('/games/:id/json', (req, res) => {
    console.log('wat..........');
    console.log(req);
    return res.status(200).json({
      wat: 'wat!!!',
      gameId: 456
    });
  })

  server.get('/b', (req, res) => {
    console.log('bbb..........');
    return app.render(req, res, '/', req.query);
  })

  server.all('*', handle);

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  })
}