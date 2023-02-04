import Head from 'next/head';

import Navigation from '../components/Navigation';
import PostCard from '../components/PostCard';
import styles from '../styles/Home.module.css';

export default function Home({ posts }: any) {
  return (
      <div>
        <Head>
          <title>Home</title>
        </Head>

        <Navigation />

        <main>
          <div className={styles.container}>
            {posts.length === 0 ? (
                <h2>No added posts</h2>
            ) : (
                <ul>
                  {posts.map((post: any, i:number) => (
                      <PostCard post={post} key={i} />
                  ))}
                </ul>
            )}
          </div>
        </main>
      </div>
  );
}

export async function getServerSideProps() {

  return {
    props: {
      posts: ['message'],
    },
  };
}