import Link from 'next/link'
import {fromUnixTime, formatRelative} from 'date-fns';


export default function GameLink({game}) {
  const {gameKey, createdAt} = game;
  const whenText = formatRelative(fromUnixTime(createdAt/1000), new Date());
  return (
    <Link href="games/[gameKey]" as={`/games/${gameKey}`}>
      <a>Game {gameKey.slice(0, 6)}, started {whenText}</a>
    </Link>
  )
}