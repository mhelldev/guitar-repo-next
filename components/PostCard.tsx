import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/PostCard.module.css';
import Image from 'next/image'
import youtubeimage from '../public/youtube.png'
import ultimateimage from '../public/ultimate.png'

export type Style = 'Jazz' | 'Fingerpicking' | 'Blues' | 'Rock/Pop'

export interface SongEntry {
    id?: string
    song: string
    artist: string
    style?: Style
    progress?: number
    youtube?: string
    ultimateGuitar?: string
    createdAt: string
    published: boolean
};

function capitalizeFirstLetter(val: string) {
    return val.charAt(0).toUpperCase() + val.slice(1);
}

export function PostCard(song: SongEntry) {
    const [publishing, setPublishing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    // Publish post
    const publishPost = async (postId: any) => {
        // change publishing state
        setPublishing(true);

        try {
            // Update post
            await fetch('/api/posts', {
                method: 'PUT',
                body: postId,
            });

            // reset the publishing state
            setPublishing(false);

            // reload the page
            return router.push(router.asPath);
        } catch (error) {
            // Stop publishing state
            return setPublishing(false);
        }
    };
    // Delete post
    const deletePost = async (postId: string) => {
        //change deleting state
        setDeleting(true);

        try {
            // Delete post
            await fetch('/api/posts', {
                method: 'DELETE',
                body: postId,
            });

            // reset the deleting state
            setDeleting(false);

            // reload the page
            return router.push(router.asPath);
        } catch (error) {
            // stop deleting state
            return setDeleting(false);
        }
    };
    return (
        <div className={styles.song}>
            <div className={styles.image}>
                <a href={song.youtube}>
                    <img
                        src={`https://img.youtube.com/vi/${song.youtube ? song.youtube.slice(song.youtube.indexOf('v=')+2) : 1}/default.jpg`}
                        alt="Picture of the author"
                    /></a>
            </div>
            <p><b style={{color: '#0700b8'}}>{capitalizeFirstLetter(song.song)}</b> <b>{capitalizeFirstLetter(song.artist)}</b></p>
            <div className={styles.progress}><b>{song.progress}%</b><progress max={100} value={song.progress || 0} /></div>
            <p>{song.style}</p>
            {song.youtube &&
                <div className={styles.image}>
                    <a href={song.youtube}>
                        <Image
                            src={youtubeimage}
                            alt="Picture of the author"
                            height={50}
                        /></a>
                </div>
            }
            {song.ultimateGuitar &&
            <div className={styles.imageblackbg}>
                <a href={song.ultimateGuitar}>
                    <Image
                        src={ultimateimage}
                        alt="Picture of the author"
                        height={50}
                    /></a>
            </div>
            }
            {!song.published ? (
                <button type="button" onClick={() => window.location.href = `/add-post?id=${song.id}`}>
                    {publishing ? 'Updating' : 'Update'}
                </button>
            ) : null}
            <button type="button" onClick={() => deletePost(song.id || '0')}>
                {deleting ? 'Deleting' : 'Delete'}
            </button>
        </div>
    );
}