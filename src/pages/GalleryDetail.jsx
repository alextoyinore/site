import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './GalleryDetail.module.css';
import albums from '../data/gallery.json';

const GalleryDetail = () => {
    const { id } = useParams();
    const album = albums.find(a => a.id === id);

    if (!album) {
        return <div className={styles.container}>Album not found</div>;
    }

    return (
        <div className={styles.container}>
            <Link to="/gallery" className={styles.backLink}>
                <ArrowLeft size={20} /> Back to Gallery
            </Link>

            <div className={styles.header}>
                <h1>{album.title}</h1>
                <p className={styles.date}>{new Date(album.date).toLocaleDateString()}</p>
            </div>

            <div className={styles.grid}>
                {album.images.map((img, index) => (
                    <div key={index} className={styles.item}>
                        <img src={img.src} alt={img.alt} loading="lazy" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryDetail;
