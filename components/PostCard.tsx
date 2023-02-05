import { useState } from 'react';
import { useRouter } from 'next/router';

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

export default function PostCard(song: SongEntry) {
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
        <>
            <li>
                <h3>{song.song} {song.artist}</h3>
                <p>{song.style}</p>
                <small>{song.createdAt}</small>
                <br />
                {!song.published ? (
                    <button type="button" onClick={() => publishPost(song.id)}>
                        {publishing ? 'Publishing' : 'Publish'}
                    </button>
                ) : null}
                <button type="button" onClick={() => deletePost(song.id)}>
                    {deleting ? 'Deleting' : 'Delete'}
                </button>
            </li>
        </>
    );
}