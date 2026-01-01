import { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import styles from './DashboardPages.module.css';
import eventsData from '../data/events.json';

const DashboardGallery = () => {
    const [selectedEvent, setSelectedEvent] = useState('');
    const [galleryImages, setGalleryImages] = useState([]);

    const handleEventChange = (e) => {
        setSelectedEvent(e.target.value);
        // Simulate fetching images for the event
        if (e.target.value) {
            setGalleryImages([
                { id: 1, url: 'https://via.placeholder.com/300' },
                { id: 2, url: 'https://via.placeholder.com/300' },
            ]);
        } else {
            setGalleryImages([]);
        }
    };

    const handleUpload = () => {
        if (!selectedEvent) return alert('Please select an event first');
        // Simulate upload
        const newImage = { id: Date.now(), url: 'https://via.placeholder.com/300' };
        setGalleryImages([...galleryImages, newImage]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Event Gallery Management</h1>
                <button className={styles.actionBtn} onClick={handleUpload}>
                    <Upload size={18} /> Upload Media
                </button>
            </div>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Event</label>
                <select
                    value={selectedEvent}
                    onChange={handleEventChange}
                    style={{ width: '100%', maxWidth: '400px', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                >
                    <option value="">-- Choose an Event --</option>
                    {eventsData.map(event => (
                        <option key={event.id} value={event.id}>{event.title}</option>
                    ))}
                </select>
            </div>

            {selectedEvent && (
                <div>
                    <h3 style={{ marginBottom: '1rem', color: 'hsl(var(--text-main))' }}>Gallery Images</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {galleryImages.map(img => (
                            <div key={img.id} style={{ position: 'relative', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                                <img src={img.url} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.5rem', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.8rem', textAlign: 'center' }}>
                                    Image #{img.id}
                                </div>
                            </div>
                        ))}
                        {galleryImages.length === 0 && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#999', border: '2px dashed #eee', borderRadius: '12px' }}>
                                <ImageIcon size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>No images uploaded for this event yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardGallery;
