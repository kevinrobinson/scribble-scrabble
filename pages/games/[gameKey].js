import PropTypes from 'prop-types';
import Link from 'next/link'
import {useState} from 'react';
import {postJSON, usePlainFetching} from '../../helpers/fetching';
import Layout from '../../components/Layout';
import Play from '../../components/Play';
import PlayDebugger from '../../components/PlayDebugger';
import {calculatePoints} from '../../shared/scribbleScrabble';


export default function Game({gameKey}) {
  const {data, error, mutate} = usePlainFetching(`/api/games/${gameKey}`);
  const [isDebugging, setDebugging] = useState(false);

  function onMove({localPlacements}) {
    // check if it is legal locally (star, or contiguous)
    // check if everything it makes is words
    // count points locally
    // ??? TODO

    // create move
    const {tiles} = data;
    const points = calculatePoints(tiles, localPlacements);
    const move = {
      playerKey: data.playerKey,
      placements: localPlacements,
      points,
      clientTimestamp: (new Date()).getTime()
    };
    // console.log('onMove', move);

    // submit
    // console.log(`Submitting your move for ${points} ${points === 1 ? 'point' : 'points'}...`);
    const url = `/api/games/${gameKey}/move`;
    const body = JSON.stringify({move});
    postJSON(url, {body}).then(mutate);
  }

  return (
    <Layout>
      {!data && !error && <div>Loading...</div>}
      {error && (
        <div>
          <div><b>There was an error loading game <b>{gameKey}</b>.</b></div>
          <div><Link href="/" as="/"><a>Back to home</a></Link></div>
        </div>
      )}
      {data && !isDebugging && (
        <Play
          key={JSON.stringify(data)} /* TODO(kr) a hack for when updates on moves come back */
          game={data}
          onMove={onMove}
          onDebug={() => setDebugging(true)}
        />
      )}
      {data && isDebugging && (
        <PlayDebugger
          gameKey={gameKey}
          data={data}
          error={error}
          mutate={mutate}
          onDone={() => setDebugging(false)}
        />
      )}
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
