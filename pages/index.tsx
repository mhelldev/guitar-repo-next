import Head from 'next/head';

import Navigation from '../components/Navigation';
import { SongEntry, PostCard } from '../components/PostCard';
import styles from '../styles/Home.module.css';

export default function Home({songs}:any) {
    
    return (
        <div>
            <Head>
                <title>Songbook</title>
            </Head>

            <Navigation />

            <main>
                <div className={styles.container}>
                    {songs.length === 0 ? (
                        <h2>No added posts</h2>
                    ) : (
                        songs.map((song : SongEntry, i: number) => (
                            <PostCard {...song} key={i} />
                        ))

                    )}
                </div>
            </main>
        </div>
    );
}

export async function getServerSideProps() {
    // get the current environment
    let dev = process.env.NODE_ENV !== 'production';
    let { DEV_URL, PROD_URL } = process.env;

    // request posts from api
    let response = await fetch(`${dev ? DEV_URL : PROD_URL}/api/posts`);
    // extract the data
    let data = await response.json();

    return {
        props: {
            songs: data['message'],
        },
    };
}