import getConfig from 'next/config'
import Layout from '../../components/Layout';
import {useMagic} from '../../hooks/useMagic';

export default function Game({gameKey}) {
  const {data, error, isValidating, mutate} = useMagic(`/api/games/${gameKey}`);
  return (
    <Layout>
      <h1>game: {gameKey}</h1>
      <pre>data: {JSON.stringify(data, null, 2)}</pre>
      <pre>error: {JSON.stringify(error, null, 2)}</pre>
      <pre>isValidating: {JSON.stringify(isValidating, null, 2)}</pre>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const {gameKey} = context.params;
  return {
    props: {
      gameKey
    }
  };
}
