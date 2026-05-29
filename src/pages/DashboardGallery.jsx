import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Plus, Trash2, X, FolderPlus, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './DashboardPages.module.css';
import staticAlbums from '../data/gallery.json';
import ImageUpload from '../components/ImageUpload';
import { uploadImageToCloudinary } from '../utils/cloudinary';

// Generate a URL-safe slug from a string
const toSlug = (str) =>
    str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') +
    '-' + Date.now();

const DashboardGallery = () => {
    const [albums, setAlbums] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState('');
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadingBatch, setUploadingBatch] = useState(false);

    // Create album modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAlbum, setNewAlbum] = useState({ title: '', date: new Date().toISOString().split('T')[0], cover: '' });
    const [linkedEventId, setLinkedEventId] = useState('');
    const [creating, setCreating] = useState(false);

    // ── Fetch albums and events on mount ─────────────────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            if (isSupabaseConfigured) {
                try {
                    const [albumRes, eventRes] = await Promise.all([
                        supabase.from('gallery_albums').select('id, title').order('created_at', { ascending: false }),
                        supabase.from('events').select('id, title, date').order('date', { ascending: false })
                    ]);
                    if (albumRes.data) setAlbums(albumRes.data);
                    if (eventRes.data) setEvents(eventRes.data);
                    return;
                } catch (err) {
                    console.error('Error fetching gallery data:', err);
                }
            }
            setAlbums(staticAlbums.map(a => ({ id: a.id, title: a.title })));
        };
        fetchData();
    }, []);

    // ── Load photos when album selected ──────────────────────────────────────
    const handleAlbumChange = async (albumId) => {
        setSelectedAlbum(albumId);
        setGalleryImages([]);
        if (!albumId) return;

        setLoading(true);
        if (isSupabaseConfigured) {
            try {
                const { data, error } = await supabase
                    .from('gallery_photos')
                    .select('*')
                    .eq('album_id', albumId)
                    .order('created_at', { ascending: true });
                if (error) throw error;
                setGalleryImages(data.map(img => ({ id: img.id, url: img.src, alt: img.alt })));
                setLoading(false);
                return;
            } catch (err) {
                console.error('Error fetching photos:', err);
            }
        }
        const alb = staticAlbums.find(a => a.id === albumId);
        setGalleryImages(alb ? (alb.images || []).map((url, i) => ({ id: i + 1, url })) : []);
        setLoading(false);
    };

    // ── Create new album ──────────────────────────────────────────────────────
    const handleCreateAlbum = async (e) => {
        e.preventDefault();
        if (!newAlbum.title.trim()) return alert('Please enter an album title.');
        setCreating(true);

        const slug = toSlug(newAlbum.title);
        const payload = {
            id: slug,
            title: newAlbum.title.trim(),
            date: newAlbum.date,
            cover: newAlbum.cover || null
        };

        if (isSupabaseConfigured) {
            try {
                const { error } = await supabase.from('gallery_albums').insert([payload]);
                if (error) throw error;
                const newEntry = { id: slug, title: newAlbum.title.trim() };
                setAlbums(prev => [newEntry, ...prev]);
                setShowCreateModal(false);
                setNewAlbum({ title: '', date: new Date().toISOString().split('T')[0], cover: '' });
                setLinkedEventId('');
                // Auto-select the newly created album
                handleAlbumChange(slug);
                setCreating(false);
                return;
            } catch (err) {
                console.error('Error creating album:', err);
                alert('Could not create album. Please try again.');
                setCreating(false);
                return;
            }
        }
        // Simulation fallback
        const newEntry = { id: slug, title: newAlbum.title.trim() };
        setAlbums(prev => [newEntry, ...prev]);
        setShowCreateModal(false);
        setNewAlbum({ title: '', date: new Date().toISOString().split('T')[0], cover: '' });
        setLinkedEventId('');
        setCreating(false);
        alert('Album created! (Simulation)');
    };

    // ── File selector triggers ────────────────────────────────────────────────
    const handleUploadClick = () => {
        if (!selectedAlbum) return alert('Please select an album first.');
        document.getElementById('gallery-multi-file-input')?.click();
    };

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploadingBatch(true);
        try {
            for (const file of files) {
                // Upload to Cloudinary
                const uploadedUrl = await uploadImageToCloudinary(file);
                const altText = file.name.split('.')[0] || 'Gallery photo';

                if (isSupabaseConfigured) {
                    const { data, error } = await supabase
                        .from('gallery_photos')
                        .insert([{ album_id: selectedAlbum, src: uploadedUrl, alt: altText }])
                        .select();
                    if (error) throw error;
                    if (data && data.length > 0) {
                        setGalleryImages(prev => [...prev, { id: data[0].id, url: data[0].src, alt: data[0].alt }]);
                    }
                } else {
                    // Fallback simulated list entry
                    setGalleryImages(prev => [...prev, { 
                        id: Date.now() + Math.random(), 
                        url: uploadedUrl, 
                        alt: altText 
                    }]);
                }
            }
        } catch (err) {
            console.error('Error uploading batch images:', err);
            alert(`Upload failed: ${err.message || 'Please check your connection.'}`);
        } finally {
            setUploadingBatch(false);
            e.target.value = ''; // Reset input to allow selecting same file later
        }
    };

    // ── Delete photo ──────────────────────────────────────────────────────────
    const handleDeletePhoto = async (photoId) => {
        if (!confirm('Delete this photo?')) return;
        if (isSupabaseConfigured) {
            try {
                const { error } = await supabase.from('gallery_photos').delete().eq('id', photoId);
                if (error) throw error;
                setGalleryImages(prev => prev.filter(img => img.id !== photoId));
                return;
            } catch (err) {
                console.error('Error deleting photo:', err);
                alert('Could not delete photo.');
                return;
            }
        }
        setGalleryImages(prev => prev.filter(img => img.id !== photoId));
    };

    // When an event is picked in create modal, pre-fill the album title
    const handleEventLink = (eventId) => {
        setLinkedEventId(eventId);
        if (eventId) {
            const ev = events.find(e => String(e.id) === String(eventId));
            if (ev) {
                setNewAlbum(prev => ({ ...prev, title: ev.title, date: ev.date || prev.date }));
            }
        }
    };

    return (
        <div className={styles.container}>
            {/* Hidden native input for multi-file uploading */}
            <input
                type="file"
                id="gallery-multi-file-input"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Gallery Management</h1>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className={styles.actionBtn} onClick={() => setShowCreateModal(true)}>
                        <FolderPlus size={18} /> New Album
                    </button>
                    <button className={styles.actionBtn} onClick={handleUploadClick} disabled={!selectedAlbum || uploadingBatch}
                        style={{ opacity: selectedAlbum && !uploadingBatch ? 1 : 0.5, cursor: selectedAlbum && !uploadingBatch ? 'pointer' : 'not-allowed' }}>
                        {uploadingBatch ? <RefreshCw className={styles.spinner} size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={18} />} 
                        {uploadingBatch ? 'Uploading...' : 'Upload Photos'}
                    </button>
                </div>
            </div>

            {/* Album selector */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Gallery Album</label>
                <select
                    value={selectedAlbum}
                    onChange={(e) => handleAlbumChange(e.target.value)}
                    style={{ width: '100%', maxWidth: '460px', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                    disabled={uploadingBatch}
                >
                    <option value="">-- Choose an Album --</option>
                    {albums.map(album => (
                        <option key={album.id} value={album.id}>{album.title}</option>
                    ))}
                </select>
                {albums.length === 0 && (
                    <p style={{ marginTop: '0.75rem', color: '#888', fontSize: '0.9rem' }}>
                        No albums yet. Click <strong>New Album</strong> to create one.
                    </p>
                )}
            </div>

            {/* Loading state for single album fetch */}
            {loading && <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading photos...</div>}

            {/* Uploading batch spinner banner */}
            {uploadingBatch && (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                    background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd',
                    padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem'
                }}>
                    <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontWeight: '500' }}>Processing and uploading your images to Cloudinary...</span>
                </div>
            )}

            {!loading && selectedAlbum && (
                <div>
                    <h3 style={{ marginBottom: '1rem', color: 'hsl(var(--text-main))' }}>
                        Photos ({galleryImages.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {galleryImages.map(img => (
                            <div key={img.id} style={{ position: 'relative', height: '160px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #eee', boxShadow: '0 2px 6px rgba(0,0,0,0.07)' }}>
                                <img src={img.url} alt={img.alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button
                                    onClick={() => handleDeletePhoto(img.id)}
                                    title="Delete photo"
                                    style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(220,38,38,0.85)', border: 'none', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}
                                    disabled={uploadingBatch}
                                >
                                    <Trash2 size={14} />
                                </button>
                                {img.alt && (
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.4rem 0.6rem', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {img.alt}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Upload placeholder */}
                        <div
                            onClick={handleUploadClick}
                            title="Upload photo"
                            style={{ height: '160px', borderRadius: '10px', border: '2px dashed #ddd', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#aaa', gap: '0.5rem', transition: 'border-color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'hsl(var(--primary))'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#ddd'}
                        >
                            <Plus size={28} />
                            <span style={{ fontSize: '0.85rem' }}>Add Photos</span>
                        </div>

                        {galleryImages.length === 0 && !uploadingBatch && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#999' }}>
                                <ImageIcon size={40} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
                                <p>No photos in this album yet. Click Upload Photos to add some.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Create Album Modal */}
            {showCreateModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Create New Album</h2>
                            <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                                <X size={22} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateAlbum} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Link to event (optional) */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', fontSize: '0.9rem' }}>
                                    Link to Event <span style={{ color: '#aaa', fontWeight: 400 }}>(optional — auto-fills title)</span>
                                </label>
                                <select
                                    value={linkedEventId}
                                    onChange={(e) => handleEventLink(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem' }}
                                >
                                    <option value="">-- None (standalone album) --</option>
                                    {events.map(ev => (
                                        <option key={ev.id} value={ev.id}>
                                            {ev.title} ({new Date(ev.date).toLocaleDateString()})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Album title */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', fontSize: '0.9rem' }}>Album Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={newAlbum.title}
                                    onChange={(e) => setNewAlbum(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g. Women Empowerment Workshop 2026"
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Album date */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', fontSize: '0.9rem' }}>Album Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={newAlbum.date}
                                    onChange={(e) => setNewAlbum(prev => ({ ...prev, date: e.target.value }))}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Cover image uploader */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', fontSize: '0.9rem' }}>
                                    Cover Image <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span>
                                </label>
                                <ImageUpload
                                    value={newAlbum.cover}
                                    onChange={(url) => setNewAlbum(prev => ({ ...prev, cover: url }))}
                                    aspect="thumbnail"
                                    label="Upload Album Cover"
                                    subLabel="WEBP, PNG, JPG (max. 5MB)"
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    style={{ padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: '500' }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className={styles.actionBtn} disabled={creating}>
                                    <FolderPlus size={16} />
                                    {creating ? 'Creating...' : 'Create Album'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardGallery;
