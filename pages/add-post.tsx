import {SongEntry, Style } from '@/components/PostCard';
import { useState } from 'react';

import Navigation from '../components/Navigation';
import styles from '../styles/Home.module.css';

export default function AddPost() {
    const [song, setSong] = useState<string>('');
    const [artist, setArtist] = useState<string>('');
    const [error, setError] = useState<string>('')
    const [message, setMessage] = useState<string>('')

    const handlePost = async (e: any) => {
        e.preventDefault();

        // reset error and message
        setError('');
        setSong('');
        setArtist('');

        // fields check
        if (!song || !artist) return setError('All fields are required');

        // post structure
        let songEntry: SongEntry = {
            song,
            artist,
            published: false,
            createdAt: new Date().toISOString(),
        };
        // save the post
        let response = await fetch('/api/posts', {
            method: 'POST',
            body: JSON.stringify(songEntry),
        });

        // get the data
        let data = await response.json();

        if (data.success) {
            // reset the fields
            setSong('');
            setArtist('');
            // set the message
            return setMessage(data.message);
        } else {
            // set the error
            return setError(data.message);
        }
    };

    return (
        <div>
            <Navigation />
            <div className={styles.container}>
                <form onSubmit={handlePost} className={styles.form}>
                    {error ? (
                        <div className={styles.formItem}>
                            <h3 className={styles.error}>{error}</h3>
                        </div>
                    ) : null}
                    {message ? (
                        <div className={styles.formItem}>
                            <h3 className={styles.message}>{message}</h3>
                        </div>
                    ) : null}
                    <div className={styles.formItem}>
                        <label>Song</label>
                        <input
                            type="text"
                            name="song"
                            onChange={(e) => setSong(e.target.value)}
                            value={song}
                            placeholder="title"
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label>Artist</label>
                        <input
                            type="text"
                            name="artist"
                            onChange={(e) => setArtist(e.target.value)}
                            value={artist}
                            placeholder="Post content"
                        />
                    </div>
                    <div className={styles.formItem}>
                        <button type="submit">Add song</button>
                    </div>
                </form>
            </div>
        </div>
    );
}