import {useEffect, useState} from 'react';
import {postJSON} from '../helpers/fetching'


export default function NewGame({children}) {
  const [isCreating, setIsCreating] = useState(false);
  const [game, setGame] = useState(null);
  useEffect(() => {
    if (!isCreating) return;
    postJSON('/api/games').then(setGame);
  }, [isCreating]);

  useEffect(() => {
    if (!game) return;
    window.location = `/games/${game.key}`;
  }, [game])

  return (
    <button disabled={isCreating} type="button" onClick={e => setIsCreating(true)}>
      {children}
    </button>
  );
}