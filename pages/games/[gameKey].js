import PropTypes from 'prop-types';
import {useState} from 'react';
import {usePlainFetching} from '../../helpers/fetching';
import Layout from '../../components/Layout';
import Play from '../../components/Play';
import PlayDebugger from '../../components/PlayDebugger';


export default function Game({gameKey}) {
  const {data, error, mutate} = usePlainFetching(`/api/games/${gameKey}`);
  const [isPlaying, setPlaying] = useState(false);
  return (
    <Layout>
      {data && isPlaying
        ? <Play game={data} onDebug={() => setPlaying(false)} />
        : <PlayDebugger
            gameKey={gameKey}
            data={data}
            error={error}
            mutate={mutate}
            onDone={() => setPlaying(true)} />
      }
    </Layout>
  );
}
Game.propTypes = {
  gameKey: PropTypes.string.isRequired
};

export async function getServerSideProps(context) {
  const {gameKey} = context.params;
  return {
    props: {gameKey}
  };
}
