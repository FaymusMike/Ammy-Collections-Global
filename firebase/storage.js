// /firebase/storage.js
// Cloud Storage Integration

// Cloudinary configuration (free tier)
const CLOUDINARY_CLOUD_NAME = 'dftjnisn5'; // Replace with your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = 'ammy_collections'; // Replace with your upload preset

// Upload image to Cloudinary
async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        if (data.secure_url) {
            return {
                success: true,
                url: data.secure_url,
                publicId: data.public_id
            };
        }
        throw new Error('Upload failed');
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return { success: false, error: error.message };
    }
}

// Upload to Firebase Storage (alternative)
async function uploadToFirebaseStorage(file, path) {
    try {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`${path}/${Date.now()}_${file.name}`);
        const snapshot = await fileRef.put(file);
        const url = await snapshot.ref.getDownloadURL();
        
        return {
            success: true,
            url: url,
            path: snapshot.ref.fullPath
        };
    } catch (error) {
        console.error('Firebase storage upload error:', error);
        return { success: false, error: error.message };
    }
}

// Upload product image
async function uploadProductImage(file, productId) {
    const result = await uploadToCloudinary(file);
    if (result.success) {
        // Store URL in Firestore
        await db.collection('products').doc(productId).update({
            image: result.url,
            imagePublicId: result.publicId
        });
    }
    return result;
}

// Upload blog featured image
async function uploadBlogImage(file, postId) {
    const result = await uploadToCloudinary(file);
    if (result.success) {
        await db.collection('blog_posts').doc(postId).update({
            featuredImage: result.url,
            imagePublicId: result.publicId
        });
    }
    return result;
}

// Upload category image
async function uploadCategoryImage(file, categoryId) {
    const result = await uploadToCloudinary(file);
    if (result.success) {
        await db.collection('categories').doc(categoryId).update({
            image: result.url,
            imagePublicId: result.publicId
        });
    }
    return result;
}

// Upload banner image
async function uploadBannerImage(file, bannerId) {
    const result = await uploadToCloudinary(file);
    if (result.success) {
        await db.collection('banners').doc(bannerId).update({
            image: result.url,
            imagePublicId: result.publicId
        });
    }
    return result;
}

// Delete image from Cloudinary
async function deleteFromCloudinary(publicId) {
    // Note: Cloudinary delete requires server-side implementation for security
    // This is a placeholder - implement via Cloudinary API with signature
    console.log('Delete request for:', publicId);
    return { success: true };
}

// Export functions
window.storageFunctions = {
    uploadToCloudinary,
    uploadToFirebaseStorage,
    uploadProductImage,
    uploadBlogImage,
    uploadCategoryImage,
    uploadBannerImage,
    deleteFromCloudinary
};