import Layout from '../components/Layout';

export default function Hello() {
  return (
    <Layout>
      <h1>hello!</h1>
      <form>
        <div>what's your name?</div>
        <input type="text" placeholder="M. Webster" />
        <button type="submit">ok</button>
      </form>
    </Layout>
  );
}
