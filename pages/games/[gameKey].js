import getConfig from 'next/config'
import {usePlainFetching} from '../../helpers/fetching';
import Layout from '../../components/Layout';
import GameLink from '../../components/GameLink';


export default function Game({gameKey}) {
  const {data, error, isValidating, mutate} = usePlainFetching(`/api/games/${gameKey}`);
  return (
    <Layout>
      <h1>game {gameKey.slice(0, 6)}</h1>
      {data && <GameLink game={data} />}
      {data && <Scribble game={data} />}
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


function Scribble({game}) {
  const {players, letters, moves} = game;
  return (
    <div>
      <div>players: {players.length}</div>
      <div>letters: {letters.map(letter => letter.key).join(' ')}</div>
      <div>moves: {moves.length}</div>
    </div>)
}