import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { uploadImageToCloudinary, isCloudinaryConfigured } from '../utils/cloudinary';
import styles from './ImageUpload.module.css';

/**
 * Premium Image Upload Component with Cloudinary Preset Power
 * 
 * @param {string} value - Current image URL
 * @param {function} onChange - Triggered on successful upload or clear: (url) => void
 * @param {string} aspect - Aspect ratio: 'banner' | 'thumbnail' | 'square'
 * @param {string} label - Primary instruction label
 * @param {string} subLabel - Secondary format / size guidelines
 */
const ImageUpload = ({
    value,
    onChange,
    aspect = 'thumbnail',
    label = 'Drag and drop an image, or click to browse',
    subLabel = 'PNG, JPG, or WEBP (max. 5MB)'
}) => {
    const [loading, setLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    // Determines aspect ratio class
    const getAspectClass = () => {
        if (aspect === 'banner') return styles.bannerAspect;
        if (aspect === 'square') return styles.squareAspect;
        return styles.thumbnailAspect;
    };

    const handleFileChange = async (file) => {
        if (!file) return;

        // Simple validation
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds the 5MB limit.');
            return;
        }

        setLoading(true);
        try {
            const uploadedUrl = await uploadImageToCloudinary(file);
            onChange(uploadedUrl);
        } catch (error) {
            alert(`Upload failed: ${error.message || 'Please try again.'}`);
        } finally {
            setLoading(false);
        }
    };

    const onFileInputChange = (e) => {
        const file = e.target.files?.[0];
        handleFileChange(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        handleFileChange(file);
    };

    const triggerFileBrowse = () => {
        fileInputRef.current?.click();
    };

    const handleClear = (e) => {
        e.stopPropagation();
        if (fileInputRef.current) fileInputRef.current.value = '';
        onChange('');
    };

    // Detect if we are using the simulated blob URL
    const isSimulated = value && value.startsWith('blob:');

    // ── LOADING STATE ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className={`${styles.uploadZone} ${getAspectClass()}`}>
                <div className={styles.loader}>
                    <RefreshCw className={styles.spinner} size={28} />
                    <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>Uploading your image...</p>
                </div>
            </div>
        );
    }

    // ── PREVIEW STATE (IMAGE EXISTS) ─────────────────────────────────────────
    if (value) {
        return (
            <div className={`${styles.previewContainer} ${getAspectClass()}`}>
                {/* Simulated URL Badge */}
                {isSimulated && (
                    <span className={styles.badge} title="Temporary preview. Save changes to keep locally.">
                        Simulated Upload
                    </span>
                )}
                {!isCloudinaryConfigured && !isSimulated && (
                    <span className={styles.badge} style={{ background: '#d1fae5', color: '#065f46' }}>
                        Static Preset URL
                    </span>
                )}

                <img src={value} alt="Preview" className={styles.previewImage} />
                
                {/* Hover controls overlay */}
                <div className={styles.overlay}>
                    <button
                        type="button"
                        onClick={triggerFileBrowse}
                        className={`${styles.overlayBtn} ${styles.replaceBtn}`}
                    >
                        <Upload size={14} /> Replace
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className={`${styles.overlayBtn} ${styles.removeBtn}`}
                    >
                        <X size={14} /> Remove
                    </button>
                </div>

                {/* Hidden input to allow clicking Replace */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileInputChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
            </div>
        );
    }

    // ── DROPZONE / DEFAULT STATE ────────────────────────────────────────────
    return (
        <div
            className={`${styles.uploadZone} ${dragOver ? styles.dragOver : ''} ${getAspectClass()}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileBrowse}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileInputChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    background: 'rgba(22, 45, 87, 0.05)',
                    borderRadius: '50%',
                    padding: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'hsl(var(--primary))'
                }}>
                    <Upload size={22} />
                </div>
                <span className={styles.uploadZoneText}>{label}</span>
                <span className={styles.subText}>{subLabel}</span>
            </div>
        </div>
    );
};

export default ImageUpload;
