// /assets/js/main.js
// Main JavaScript File - All Website Logic

// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = null;

// Debug flag
const DEBUG = true;

// Helper function for logging
function log(message, data = null) {
    if (DEBUG && data) {
        console.log(`[Ammy Collections] ${message}:`, data);
    } else if (DEBUG) {
        console.log(`[Ammy Collections] ${message}`);
    }
}

// Update cart count display
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        if (el) el.textContent = count;
    });
    log('Cart count updated', count);
}

// Add product to cart
function addToCart(product) {
    log('Adding to cart', product);
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity++;
        existing.totalPrice = existing.price * existing.quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            totalPrice: product.price
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (typeof renderCartItems === 'function') renderCartItems();
    showNotification('Item removed from cart', 'info');
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
    notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Load products from Firestore or demo data
async function loadFeaturedProducts() {
    const grid = document.getElementById('featuredProductsGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="col-12 text-center"><div class="spinner"></div></div>';
    
    try {
        if (typeof db !== 'undefined') {
            const snapshot = await db.collection('products').where('featured', '==', true).limit(8).get();
            if (!snapshot.empty) {
                const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                renderProducts(products, grid);
                return;
            }
        }
        // Demo products if Firebase not ready
        renderDemoProducts(grid);
    } catch (error) {
        log('Error loading products', error);
        renderDemoProducts(grid);
    }
}

function renderProducts(products, container) {
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="col-md-3 col-sm-6" data-aos="fade-up">
            <div class="product-card">
                <div class="product-image">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-category">${product.category || 'Luxury'}</p>
                    <p class="product-price">₦${(product.price || 0).toLocaleString()}</p>
                    <div class="product-actions">
                        <button class="btn-cart" onclick="addToCartFromCard('${product.id}')">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <a href="https://wa.me/2348012345678?text=I want to order ${encodeURIComponent(product.name)} for ₦${product.price}" 
                           class="btn-whatsapp" target="_blank">
                            <i class="fab fa-whatsapp"></i> Order
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderDemoProducts(container) {
    const demoProducts = [
        { id: '1', name: 'Luxury Wrist Watch', price: 65000, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400', category: 'Accessories', badge: 'Best Seller' },
        { id: '2', name: 'Designer Handbag', price: 125000, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', category: 'Fashion', badge: 'New' },
        { id: '3', name: 'iPhone 14 Pro', price: 850000, image: 'https://images.unsplash.com/photo-1678652196163-38e0a1b86ff6?w=400', category: 'Electronics' },
        { id: '4', name: 'Gold Plated Necklace', price: 35000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', category: 'Jewelry', badge: 'Limited' },
        { id: '5', name: 'Smart LED TV 55"', price: 350000, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', category: 'Electronics' },
        { id: '6', name: 'Air Fryer', price: 45000, image: 'https://images.unsplash.com/photo-1586000716336-9bfb60c6cdb4?w=400', category: 'Home Appliances' }
    ];
    renderProducts(demoProducts, container);
}

// Load categories
async function loadCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    
    const categories = [
        { name: 'Fashion', icon: 'fa-tshirt', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400', count: 150 },
        { name: 'Electronics', icon: 'fa-laptop', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', count: 89 },
        { name: 'Jewelry', icon: 'fa-gem', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', count: 45 },
        { name: 'Home Appliances', icon: 'fa-blender', image: 'https://images.unsplash.com/photo-1586000716336-9bfb60c6cdb4?w=400', count: 67 }
    ];
    
    grid.innerHTML = categories.map(cat => `
        <div class="col-md-3 col-sm-6" data-aos="fade-up">
            <div class="category-card" onclick="location.href='/shop/shop.html?category=${cat.name}'">
                <img src="${cat.image}" alt="${cat.name}">
                <div class="category-overlay">
                    <i class="fas ${cat.icon}"></i>
                    <h4>${cat.name}</h4>
                    <p>${cat.count}+ Products</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Newsletter subscription
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        
        if (typeof db !== 'undefined') {
            try {
                await db.collection('newsletter').add({
                    email: email,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    source: 'website'
                });
                showNotification('Subscribed successfully! Check your email.', 'success');
                form.reset();
            } catch (error) {
                log('Newsletter error', error);
                showNotification('Subscription successful!', 'success');
                form.reset();
            }
        } else {
            showNotification('Thanks for subscribing!', 'success');
            form.reset();
        }
    });
}

// Global function for adding to cart from product card
window.addToCartFromCard = (productId) => {
    // Find product details (demo implementation)
    const product = { id: productId, name: 'Premium Product', price: 50000 };
    addToCart(product);
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    log('DOM fully loaded and parsed');
    
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
        log('AOS initialized');
    }
    
    // Load data
    loadFeaturedProducts();
    loadCategories();
    updateCartCount();
    initNewsletter();
    
    // Mobile menu close on click
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#/' && href !== '#0') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    log('All components initialized');
});