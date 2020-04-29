import express from 'express';
import next from 'next';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import {enforceHTTPS, configuredCookieSession} from './middleware';
import onAllGames from './endpoints/onAllGames';
import onGameKey from './endpoints/onGameKey';
import onCreateGame from './endpoints/onCreateGame';
import onUpdatePlayerName from './endpoints/onUpdatePlayerName';
import onPlayerName from './endpoints/onPlayerName';


function addRoutes(server) {
  server.get('/api/games', onAllGames);
  server.get('/api/games/:gameKey', onGameKey);
  server.post('/api/games', onCreateGame);
  server.get('/api/player', onPlayerName);
  server.post('/api/players/name', onUpdatePlayerName);
}

function addMiddleware(server) {
  server.use(bodyParser.json())
  server.use(configuredCookieSession());
  server.use(enforceHTTPS);
  server.use(helmet());
}

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const nextHandler = app.getRequestHandler();
app.prepare().then(() => {
  const server = express();
  addMiddleware(server);
  addRoutes(server);
  server.all('*', nextHandler);
  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Server up, PORT=${port}`);
  })
});
