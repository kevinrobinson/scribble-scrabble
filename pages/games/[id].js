import Layout from '../../components/Layout';


export default function Game({id}) {
  return (
    <Layout>
      <h1>game: {id}</h1>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const {id} = context.params;
  // const res = await fetch(`https://.../data`)
  // const data = await res.json()
  return {
    props: {
      id
    }
  };
}
