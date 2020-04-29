import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import Router from 'next/router'
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
    Router.push('/games/[gameKey]', `/games/${game.gameKey}`);
  }, [game])

  return (
    <button disabled={isCreating} type="button" onClick={() => setIsCreating(true)}>
      {children}
    </button>
  );
}
NewGame.propTypes = {
  children: PropTypes.node.isRequired
};