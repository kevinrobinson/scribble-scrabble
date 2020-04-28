import Layout from '../components/Layout';
import Link from 'next/link'


export default function Home() {
  return (
    <Layout>
      <h1>games</h1>
      <div>
        <Link href="/games/123"><a>4/24/20</a></Link>
      </div>
      <div><Link href="/new"><button>new game!</button></Link></div>
      <div><Link href="/hello"><a>say hi</a></Link></div>
    </Layout>
  )
}
