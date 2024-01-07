// cart.js

// Define products and cart globally
let cart = [];
let products = [];

// Wait for the DOM to be fully loaded before executing functions
document.addEventListener('DOMContentLoaded', () => {
    loadCartItems();
    initializeCart();
});

// Load cart items from local storage
function loadCartItems() {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = storedCart;
    // Ensure each cart item has the 'quantity' property
    cart.forEach(item => {
        if (!item.quantity || typeof item.quantity !== 'number') {
            item.quantity = 0; // Set a default quantity if not present or invalid
        }
    });
}

// Function to calculate total items in the cart
function calculateTotalItems() {
    return cart.reduce((total, item) => total + 1, 0);
}

// Function to display cart items
function displayCart() {
    console.log("Displaying cart:", cart);

    const cartItemsContainer = document.getElementById('cart-items');
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');

    if (cartItemsContainer && totalItemsElement && totalPriceElement) {
        cartItemsContainer.innerHTML = '';
        totalItemsElement.innerText = calculateTotalItems().toString();

        let totalBill = 0; // Initialize totalBill variable

        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            const itemPrice = item.price * 1; // Calculate individual item price
            totalBill += itemPrice; // Add to totalBill
            cartItemElement.innerHTML = `<p>${item.title} - Quantity: 1 - Price: ${item.price}</p>`;
            cartItemsContainer.appendChild(cartItemElement);
        });

        // Display the total bill with two decimal places
        totalPriceElement.innerText = '$' + totalBill.toFixed(2);
    }
}

// Calculate the total price of items in the cart
function calculateTotalPrice() {
    const totalPrice = cart.reduce((total, item) => {
        const itemPrice = item.price * 1;
        return isNaN(itemPrice) ? total : total + itemPrice;
    }, 0);

    return totalPrice;
}

// Function to calculate total bill from products in the cart
function calculateTotalBill() {
    let totalBill = 0;

    cart.forEach(item => {
        const itemPrice = item.price * 1;
        if (!isNaN(itemPrice)) {
            totalBill += itemPrice;
        }
    });

    return totalBill.toFixed(2);
}

// Inside the openCheckoutModal function
function openCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    const totalPriceInfo = document.getElementById('total-price-info');

    // Calculate and display the total price
    const totalPrice = calculateTotalPrice();
    totalPriceInfo.innerText = `Total Price: ${totalPrice.toFixed(2)}`;

    checkoutModal.style.display = 'block';
}

// Function to close the checkout modal
function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    checkoutModal.style.display = 'none';
}

// Function to handle checkout form submission
function handleCheckoutFormSubmit(event) {
    event.preventDefault();

    // Get form values (name, address, payment details)
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const paymentDetails = document.getElementById('payment').value;

    // Display confirmation message with order summary and bill
    let confirmationMessage = `Thank you, ${name}! Your order has been placed.\n\nOrder Summary:\n`;

    cart.forEach(item => {
        confirmationMessage += `${item.title} - Quantity: ${1} - Price: $${(item.price * 1)}\n`;
    });

    confirmationMessage += `\nTotal Price: $${calculateTotalPrice().toFixed(2)}`;

    // Calculate and display the bill
    const bill = calculateTotalBill();
    confirmationMessage += `\nBill: $${bill}`;

    alert(confirmationMessage);

    // Clear the cart and close the modal (simulating a successful order)
    cart = [];
    saveCartToLocalStorage();
    closeCheckoutModal();
    displayCart();
}

// Function to save cart to local storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to initialize the cart and set up event listeners
function initializeCart() {
    // Set up event listener for the checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', openCheckoutModal);

    // Set up event listener for the checkout form
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', handleCheckoutFormSubmit);

    // Display the initial cart
    displayCart();
}

// Function to add a product to the cart
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
    } else {
        console.error(`Product with ID ${productId} not found.`);
    }
}
