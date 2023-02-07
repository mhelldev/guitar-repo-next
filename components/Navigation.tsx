import Link from 'next/link';

import styles from '../styles/Navigation.module.css';

export default function Navigation() {
    return (
        <nav className={styles.nav}>
            <div className={styles.title}><b>Songbook</b></div>
            <ul className={styles.list}>
                <li className={styles.item}>
                    <Link href="/">
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/add-post">
                        Add post
                    </Link>
                </li>
            </ul>
        </nav>
    );
}