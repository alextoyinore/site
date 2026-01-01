import { Link } from 'react-router-dom';
import styles from './Gallery.module.css';
import albums from '../data/gallery.json';

const Gallery = () => {
    return (
        <div className={styles.container}>
            <h1>Our Gallery</h1>
            <div className={styles.grid}>
                {albums.map((album) => (
                    <Link key={album.id} to={`/gallery/${album.id}`} className={styles.albumCard}>
                        <div className={styles.coverImage}>
                            <img src={album.cover} alt={album.title} />
                        </div>
                        <div className={styles.albumInfo}>
                            <h3>{album.title}</h3>
                            <p>{album.images.length} Photos</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
