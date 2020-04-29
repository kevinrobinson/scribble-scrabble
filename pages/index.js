import styles from './index.module.css';
import {usePlainFetching} from '../helpers/fetching';
import Layout from '../components/Layout';
import NewGame from '../components/NewGame';
import GameLink from '../components/GameLink';


export default function Home() {
  const {data} = usePlainFetching('/api/games');
  const games = (data && data.games);
  return (
    <Layout>
      <h1>games</h1>
      <div className={styles.newGame}>
        <NewGame>New game!</NewGame>
      </div>
      {!data && <div>loading...</div>}
      {games && games.length > 0 && games.map(game => (
        <div key={game.gameKey}>
          <GameLink game={game} />
        </div>
      ))}
    </Layout>
  )
}
