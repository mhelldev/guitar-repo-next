import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/PostCard.module.css';

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
    const deletePost = async (postId: any) => {
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
            <p><b style={{color: '#0700b8'}}>{capitalizeFirstLetter(song.song)}</b> <b>{capitalizeFirstLetter(song.artist)}</b></p>
            <progress max={100} value={song.progress || 0} />
            <p>{song.style}</p>
            <p>{song.youtube}</p>
            <p>{song.ultimateGuitar}</p>
            <p className={styles.small}>{song.createdAt}</p>
            {!song.published ? (
                <button type="button" onClick={() => publishPost(song.id)}>
                    {publishing ? 'Publishing' : 'Publish'}
                </button>
            ) : null}
            <button type="button" onClick={() => deletePost(song.id)}>
                {deleting ? 'Deleting' : 'Delete'}
            </button>
        </div>
    );
}