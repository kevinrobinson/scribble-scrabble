import getConfig from 'next/config'
import Link from 'next/link'
import _ from 'lodash';
import {usePlainFetching} from '../../helpers/fetching';
import Layout from '../../components/Layout';
import GameLink from '../../components/GameLink';
import JoinGame from '../../components/JoinGame';


export default function Game({gameKey}) {
  const {data, error, isValidating, mutate} = usePlainFetching(`/api/games/${gameKey}`);
  return (
    <Layout>
      <h1>game {gameKey.slice(0, 6)}</h1>
      {error && (
        <div>
          <div><b>There was an error loading the game.</b></div>
          <div><Link href="/" as="/"><a>Back to home</a></Link></div>
        </div>
      )}
      {data && <GameLink game={data} />}
      {data && <Scribble game={data} reload={mutate} />}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const {gameKey} = context.params;
  return {
    props: {gameKey}
  };
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
    </div>)
}