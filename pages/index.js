import Link from 'next/link'
import {fromUnixTime, formatRelative} from 'date-fns';
import styles from './index.module.css';
import {useAutoFetchingMagic} from '../helpers/fetching';
import Layout from '../components/Layout';
import NewGame from '../components/NewGame';


export default function Home() {
  const {data} = useAutoFetchingMagic('/api/games');
  const games = (data && data.games);
  return (
    <Layout>
      <h1>games</h1>
      {games && games.length > 0 && games.map(game => (
        <GameLink key={game.key} game={game} />
      ))}
      <div className={styles.newGame}>
        <NewGame>New game!</NewGame>
      </div>
      <div><Link href="/hello"><a>say hi</a></Link></div>
    </Layout>
  )
}

function GameLink({game}) {
  const {doc} = game;
  const whenText = formatRelative(fromUnixTime(doc.createdAt/1000), new Date());
  return (
    <div>
      <Link href={`/games/${game.key}`}>
        <a>{game.key.slice(0, 6)}, {whenText}</a>
      </Link>
    </div>
  );
}