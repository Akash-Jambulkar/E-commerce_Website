// index.js

// Define products and cart globally
let products = [];
let cart = [];

// Define product API URL
const productApiUrl = 'https://fakestoreapi.com/products';

// Wait for the DOM to be fully loaded before executing functions
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

// Fetch products from the API
async function fetchProducts() {
    try {
        const response = await fetch(productApiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        products = data;
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Error fetching products. Please try again.');
    }
}

// Display products on the homepage with transitions
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach((product, index) => {
        const productItem = createProductItem(product, index);
        productList.appendChild(productItem);

        // Apply a staggered fade-in effect
        setTimeout(() => {
            productItem.style.opacity = 1;
            productItem.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Create HTML for a product item
function createProductItem(product, index) {
    const productItem = document.createElement('div');
    productItem.classList.add('col-md-4', 'product', 'animate__animated', 'animate__fadeIn');

    productItem.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="img-fluid">
        <h5 class="mt-2">${product.title}</h5>
        <p>${product.price}$</p>
        <button class="btn btn-primary" onclick="addToCart(${product.id}, ${index})">Add to Cart</button>
    `;

    return productItem;
}

// Add a product to the cart with transitions
function addToCart(productId, index) {
    const selectedProduct = products.find(product => product.id === productId);

    if (selectedProduct) {
        cart.push(selectedProduct);
        updateCartCount();
        saveCartToLocalStorage();
        updateRecommendations();
        navigateToCart(); // Separate function for navigation
    }
}

// Function to navigate to the cart page
function navigateToCart() {
    window.location.href = 'cart.html';
}

// Update the cart count in the header with transitions
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.innerText = cart.length.toString();

    // Apply a bounce effect to the cart count
    cartCountElement.classList.add('animate__animated', 'animate__bounce');

    // Remove the bounce effect after the animation duration
    setTimeout(() => {
        cartCountElement.classList.remove('animate__animated', 'animate__bounce');
    }, 1000);
}

// Function to save cart to local storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update recommendations based on cart items
function updateRecommendations() {
    // Implement logic to update recommendations based on cart items
    // For simplicity, let's assume that recommendations are not affected by the cart
    // You can customize this function based on your application's logic
}

// Function to toggle the cart and navigate to cart.html
function toggleCart() {
    console.log('toggleCart called');
    saveCartToLocalStorage();

    // Get the selected product data (for demonstration, assume the selected product is the first one)
    const selectedProductId = products[0].id;
    const selectedProduct = products.find(product => product.id === selectedProductId);

    // Add the selected product data to the cart
    if (selectedProduct) {
        cart.push(selectedProduct);
        saveCartToLocalStorage();
        updateRecommendations(); // Update recommendations based on cart items
    }

    const cartData = JSON.stringify(cart);
    window.location.href = `cart.html?cartData=${encodeURIComponent(cartData)}`;
}
