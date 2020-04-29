import PropTypes from 'prop-types';
import _ from 'lodash';
import Link from 'next/link'
import JoinGame from './JoinGame';
import GameLink from './GameLink';


export default function PlayDebugger(props) {
  const {gameKey, data, error, mutate, onDone} = props;
  return (
    <div>
      <h1>game {gameKey.slice(0, 6)}</h1>
      {error && (
        <div>
          <div><b>There was an error loading the game.</b></div>
          <div><Link href="/" as="/"><a>Back to home</a></Link></div>
        </div>
      )}
      {data && (
        <div>
          <button onClick={() => onDone()}>play!</button>
          <GameLink game={data} />
          <Scribble game={data} reload={mutate} />
        </div>
      )}
    </div>
  );
}


function Scribble({game, reload}) {
  const {playerKey, gameKey, players, letters, moves} = game;
  const hasJoined = _.some(players, {playerKey});
  const playerPlayingNow = players[(moves.length % players.length)];
  const isYourTurn = (playerPlayingNow.playerKey === playerKey);
  return (
    <div>
      <div>
        {hasJoined
          ? <b>you are a part of this game</b>
          : <JoinGame gameKey={gameKey} onJoined={reload}>join?</JoinGame>
        }
      </div>
      <div>
        {isYourTurn
          ? <u>it is your turn!</u>
          : <span><b>{playerPlayingNow.name}</b> is thinking...</span>
        }
      </div>
      <div>players: {players.length} ({players.map(player => player.name).join(', ')})</div>
      <div>letters: {letters.map(letter => letter.key).join(' ')}</div>
      <div>moves: {moves.length}</div>
      <pre style={{textAlign: 'left', width: 300, height: 200, border: '1px solid #ccc', fontSize: 12, overflow: 'scroll'}}>{JSON.stringify(game, null, 2)}</pre>
    </div>
  );
}
Scribble.propTypes = {
  game: PropTypes.object.isRequired,
  reload: PropTypes.func.isRequired
};