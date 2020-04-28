import {useEffect, useState} from 'react';
import fetch from 'unfetch'
import Layout from '../components/Layout';



export default function New() {
  const [isCreating, setCreating] = useState(false);
  const [game, setGame] = useState(null);
  useEffect(() => {
    if (isCreating === false) return;
    fetch('/api/games/create')
      .then(r => r.json())
      .then(setGame);
  }, [isCreating]);

  useEffect(() => {
    if (game === null) return;
    window.location = `/games/${game.key}`;
  }, [game])

  return (
    <Layout>
      {!isCreating
        ? <div>
            <h1>start a new game?</h1>
            <button type="button" onClick={e => setCreating(true)}>yah</button>
          </div>
        : <div>
            <h1>creating...</h1>
          </div>
      }
    </Layout>
  );
}
