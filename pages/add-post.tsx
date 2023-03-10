import {SongEntry, Style } from '@/components/PostCard';
import {useEffect, useState } from 'react';

import Navigation from '../components/Navigation';
import styles from '../styles/Home.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/dist/client/router';

export default function AddPost({songs}:any) {

    const [songId, setSongId] = useState<string>('')
    const [song, setSong] = useState<string>('');
    const [artist, setArtist] = useState<string>('');
    const [style, setStyle] = useState<Style>('Rock/Pop')
    const [progress, setProgress] = useState<number>(0)
    const [youtube, setYoutube] = useState<string>('');
    const [ultimateGuitar, setUltimateGuitar] = useState<string>('');
    const [error, setError] = useState<string>('')
    const [message, setMessage] = useState<string>('')

    const router = useRouter()
    const queryId = router.query.id

    useEffect(() =>  {
        if (queryId) {
            const querySong: SongEntry = songs.find((s: SongEntry) => s.id === queryId)
            if (querySong) {
                setSongId(querySong.id || '')
                setSong(querySong.song)
                setArtist(querySong.artist)
                setStyle(querySong.style || 'Rock/Pop')
                setYoutube(querySong.youtube || '')
                setUltimateGuitar(querySong.ultimateGuitar || '')
                setProgress(querySong.progress || 0)
            }
        }
    }, [])

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
            progress,
            youtube,
            ultimateGuitar,
            style,
            published: false,
            createdAt: new Date().toISOString(),
            id: songId === '' ? uuidv4() : songId,
        };
        let response
        if (songId === '') {
            // save the post
            response = await fetch('/api/posts', {
                method: 'POST',
                body: JSON.stringify(songEntry),
            });
        } else {
            // save the post
            response = await fetch('/api/posts', {
                method: 'PUT',
                body: JSON.stringify(songEntry),
            });
        }

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
                            placeholder="artist"
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label>Style</label>
                        <select name="style" id="style" onChange={(e)=> setStyle(e.target.value as Style)}>
                            <option selected={style === 'Jazz'} value='Jazz'>Jazz</option>
                            <option selected={style === 'Fingerpicking'} value='Fingerpicking'>Fingerpicking</option>
                            <option selected={style === 'Blues'} value='Blues'>Blues</option>
                            <option selected={style === 'Rock/Pop'} value="Rock/Pop">Rock/Pop</option>
                        </select>
                    </div>
                    <div className={styles.formItem}>
                        <label>Progress</label>
                        <input
                            type="number"
                            name="progress"
                            onChange={(e) => setProgress(Number.parseFloat(e.target.value))}
                            value={progress}
                            placeholder="progress"
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label>Youtube</label>
                        <input
                            type="text"
                            name="youtube"
                            onChange={(e) => setYoutube(e.target.value)}
                            value={youtube}
                            placeholder="youtube"
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label>Ultimate Guitar</label>
                        <input
                            type="text"
                            name="ultimateGuitar"
                            onChange={(e) => setUltimateGuitar(e.target.value)}
                            value={ultimateGuitar}
                            placeholder="ultimateGuitar"
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