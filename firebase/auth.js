// /firebase/auth.js
// Firebase Authentication Module

// Admin login function
async function adminLogin(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Check if user is admin (custom claim or admin collection)
        const adminDoc = await db.collection('admins').doc(user.uid).get();
        
        if (adminDoc.exists || user.email === 'admin@ammycollections.com') {
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminEmail', user.email);
            window.location.href = '/admin/dashboard.html';
            return { success: true, message: 'Login successful' };
        } else {
            await auth.signOut();
            return { success: false, message: 'Unauthorized access' };
        }
    } catch (error) {
        console.error('Login error:', error);
        let message = 'Login failed';
        switch (error.code) {
            case 'auth/invalid-email':
                message = 'Invalid email address';
                break;
            case 'auth/user-disabled':
                message = 'Account disabled';
                break;
            case 'auth/user-not-found':
                message = 'User not found';
                break;
            case 'auth/wrong-password':
                message = 'Wrong password';
                break;
        }
        return { success: false, message };
    }
}

// Admin logout function
async function adminLogout() {
    try {
        await auth.signOut();
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminEmail');
        window.location.href = '/admin/index.html';
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, message: 'Logout failed' };
    }
}

// Check admin authentication status
function checkAdminAuth() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const adminDoc = await db.collection('admins').doc(user.uid).get();
                if (adminDoc.exists || user.email === 'admin@ammycollections.com') {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    });
}

// Protect admin routes
async function protectAdminRoute() {
    const isAuthenticated = await checkAdminAuth();
    const currentPath = window.location.pathname;
    
    if (!isAuthenticated && currentPath.includes('/admin/') && !currentPath.includes('/admin/index.html')) {
        window.location.href = '/admin/index.html';
        return false;
    }
    return true;
}

// Register new admin (super admin only)
async function registerAdmin(email, password, fullName) {
    try {
        // Create user
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Add to admins collection
        await db.collection('admins').doc(user.uid).set({
            email: email,
            fullName: fullName,
            role: 'admin',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return { success: true, message: 'Admin created successfully' };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: error.message };
    }
}

// Export functions
window.authFunctions = {
    adminLogin,
    adminLogout,
    checkAdminAuth,
    protectAdminRoute,
    registerAdmin
};

// Auto-protect admin pages if not on login page
if (window.location.pathname.includes('/admin/') && 
    !window.location.pathname.includes('/admin/index.html') &&
    !window.location.pathname.includes('/admin/login.html')) {
    protectAdminRoute();
}