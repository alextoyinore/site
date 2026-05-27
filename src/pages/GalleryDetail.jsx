import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './GalleryDetail.module.css';
import staticAlbums from '../data/gallery.json';

const GalleryDetail = () => {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlbum = async () => {
            setLoading(true);
            if (isSupabaseConfigured) {
                try {
                    const { data, error } = await supabase
                        .from('gallery_albums')
                        .select('*, gallery_photos(src, alt)')
                        .eq('id', id)
                        .single();
                    if (error) throw error;
                    if (data) {
                        setAlbum({
                            id: data.id,
                            title: data.title,
                            date: data.date,
                            cover: data.cover,
                            images: data.gallery_photos || []
                        });
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    console.error('Error fetching gallery album details from Supabase, using fallback:', error);
                }
            }
            const fallbackAlbum = staticAlbums.find(a => a.id === id);
            if (fallbackAlbum) {
                setAlbum({
                    ...fallbackAlbum,
                    images: (fallbackAlbum.images || []).map(img => typeof img === 'string' ? { src: img, alt: '' } : img)
                });
            } else {
                setAlbum(null);
            }
            setLoading(false);
        };
        fetchAlbum();
    }, [id]);

    if (loading) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', padding: '5rem' }}>
                <h2>Loading album...</h2>
            </div>
        );
    }

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
