// /firebase/firestore.js
// Firestore Database Operations

// Product Operations
async function getProducts(filters = {}) {
    try {
        let query = db.collection('products');
        
        if (filters.category) {
            query = query.where('category', '==', filters.category);
        }
        if (filters.featured) {
            query = query.where('featured', '==', true);
        }
        if (filters.limit) {
            query = query.limit(filters.limit);
        }
        
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

async function getProductById(productId) {
    try {
        const doc = await db.collection('products').doc(productId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

async function addProduct(productData) {
    try {
        const docRef = await db.collection('products').add({
            ...productData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { id: docRef.id, ...productData };
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
}

async function updateProduct(productId, productData) {
    try {
        await db.collection('products').doc(productId).update({
            ...productData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

async function deleteProduct(productId) {
    try {
        await db.collection('products').doc(productId).delete();
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

// Category Operations
async function getCategories() {
    try {
        const snapshot = await db.collection('categories').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

async function addCategory(categoryData) {
    try {
        const docRef = await db.collection('categories').add(categoryData);
        return { id: docRef.id, ...categoryData };
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
}

// Blog Operations
async function getBlogPosts(limit = 10) {
    try {
        const snapshot = await db.collection('blog_posts')
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

async function getBlogPostById(postId) {
    try {
        const doc = await db.collection('blog_posts').doc(postId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

async function createBlogPost(postData) {
    try {
        const docRef = await db.collection('blog_posts').add({
            ...postData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            views: 0
        });
        return { id: docRef.id, ...postData };
    } catch (error) {
        console.error('Error creating blog post:', error);
        throw error;
    }
}

// Order Operations
async function saveOrder(orderData) {
    try {
        const docRef = await db.collection('orders').add({
            ...orderData,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { id: docRef.id, ...orderData };
    } catch (error) {
        console.error('Error saving order:', error);
        throw error;
    }
}

// Banner Operations
async function getActiveBanners() {
    try {
        const snapshot = await db.collection('banners')
            .where('active', '==', true)
            .orderBy('order', 'asc')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching banners:', error);
        return [];
    }
}

// Export functions for use
window.dbOperations = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    addCategory,
    getBlogPosts,
    getBlogPostById,
    createBlogPost,
    saveOrder,
    getActiveBanners
};