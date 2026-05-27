import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './Gallery.module.css';
import staticAlbums from '../data/gallery.json';

const Gallery = () => {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const fetchAlbums = async () => {
            if (isSupabaseConfigured) {
                try {
                    const { data, error } = await supabase
                        .from('gallery_albums')
                        .select('*, gallery_photos(src, alt)');
                    if (error) throw error;
                    const formatted = (data || []).map(album => ({
                        id: album.id,
                        title: album.title,
                        date: album.date,
                        cover: album.cover,
                        images: album.gallery_photos || []
                    }));
                    setAlbums(formatted);
                    return;
                } catch (error) {
                    console.error('Error fetching gallery albums:', error);
                }
            }
            setAlbums(staticAlbums);
        };
        fetchAlbums();
    }, []);

    return (
        <div className={styles.container}>
            <h1>Our Gallery</h1>
            <div className={styles.grid}>
                {albums.map((album) => (
                    <Link key={album.id} to={`/gallery/${album.id}`} className={styles.albumCard}>
                        <div className={styles.coverImage}>
                            <img src={album.cover || 'https://via.placeholder.com/800x600'} alt={album.title} />
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
