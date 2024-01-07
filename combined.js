// Define products, cart, and recommendations globally
let products = [];
let cart = [];
let recommendations = [];

// Define product API URL
const productApiUrl = 'https://fakestoreapi.com/products';

// Wait for the DOM to be fully loaded before executing functions
document.addEventListener('DOMContentLoaded', () => {
    loadCartItems();
    updateCartCount();
    fetchProducts();
    displayCart(); // Display cart items on load
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

    // Check if the productList element exists before manipulating it
    if (productList) {
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
    } else {
        console.error('Product list element not found.');
    }
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
        // Check if the product is already in the cart
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...selectedProduct, quantity: 1 });
        }

        saveCartToLocalStorage();
        updateCartCount();
        updateCartSummary();
    }
}

// Update the cart count in the header with transitions
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = calculateTotalItems().toString();

        // Apply a bounce effect to the cart count
        cartCountElement.classList.add('animate__animated', 'animate__bounce');

        // Remove the bounce effect after the animation duration
        setTimeout(() => {
            cartCountElement.classList.remove('animate__animated', 'animate__bounce');
        }, 1000);
    } else {
        console.warn('Cart count element not found.');
    }
}

// Function to calculate total items in the cart
function calculateTotalItems() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Function to calculate total bill from products in the cart
function calculateTotalBill() {
    let totalBill = 0;

    cart.forEach(item => {
        totalBill += item.price * item.quantity;
    });

    return totalBill.toFixed(2);
}

// Ensure cart is loaded on window load
window.onload = function () {
    loadCartItems();
};

// Load cart items from local storage
function loadCartItems() {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = storedCart;
    updateCartCount();
    displayCart(); // Display cart items on load
}

// Function to display cart items
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.innerHTML = `<p>${item.title} - Quantity: ${item.quantity}</p>`;
            cartItemsContainer.appendChild(cartItemElement);
        });
    }
}

// Function to save cart to local storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
