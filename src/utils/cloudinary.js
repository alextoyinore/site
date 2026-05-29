/**
 * Cloudinary Upload Utility for AADI Site Dashboard
 */

export const isCloudinaryConfigured = Boolean(
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME &&
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
);

/**
 * Uploads a file directly to Cloudinary using an unsigned upload preset.
 * Fallback to local Object URL simulation if configuration is missing.
 * 
 * @param {File} file - The file object to upload
 * @returns {Promise<string>} The uploaded image secure URL
 */
export const uploadImageToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!isCloudinaryConfigured) {
        console.warn('[Cloudinary] Cloud name or upload preset is missing in environment variables. Simulating upload.');
        // Local simulation fallback: returns a temporary object URL that acts as a real preview
        return new Promise((resolve) => {
            setTimeout(() => {
                const simulatedUrl = URL.createObjectURL(file);
                resolve(simulatedUrl);
            }, 800);
        });
    }

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'Failed to upload image to Cloudinary');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('[Cloudinary] Upload failed:', error);
        throw error;
    }
};
