import {useEffect, useState} from 'react';
import Router from 'next/router'
import {postJSON} from '../helpers/fetching'


export default function JoinGame({gameKey, onJoined, children}) {
  const [isJoining, setIsJoining] = useState(false);
  const [isNavigating, setIsNavigating] = useState(null);
  useEffect(() => {
    if (!isJoining) return;
    postJSON(`/api/games/${gameKey}/join`).then(setIsNavigating);
  }, [isJoining]);

  useEffect(() => {
    if (!isNavigating) return;
    Router.push('/games/[gameKey]', `/games/${gameKey}`);
    onJoined();
  }, [isNavigating])

  return (
    <button disabled={isJoining} type="button" onClick={() => setIsJoining(true)}>
      {children}
    </button>
  );
}