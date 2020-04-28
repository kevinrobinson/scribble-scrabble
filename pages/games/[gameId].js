import Layout from '../../components/Layout';
import {useMagic} from '../../hooks/useMagic';

export default function Game({gameId}) {
  // const {data, error, isValidating, mutate} = useMagic(`/games/${gameId}/json`);
  const {data, error, isValidating, mutate} = useMagic(`/api/games/${gameId}`);
  return (
    <Layout>
      <h1>game: {gameId}</h1>
      <pre>data: {JSON.stringify(data, null, 2)}</pre>
      <pre>error: {JSON.stringify(error, null, 2)}</pre>
      <pre>isValidating: {JSON.stringify(isValidating, null, 2)}</pre>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const {gameId} = context.params;
  return {
    props: {
      gameId
    }
  };
}
