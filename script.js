// Utility functions for localStorage cart management

// Retrieve cart from localStorage or return empty array
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

// Save cart back to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(product) {
  const cart = getCart();
  // Check if item already exists
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
}

// Remove item from cart by ID
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  updateCartCount();
  renderCart();
}

// Update cart count in header
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const countSpans = document.querySelectorAll('#cart-count');
  countSpans.forEach(span => {
    span.textContent = count > 0 ? `(${count})` : '';
  });
}

// Render cart on cart page
function renderCart() {
  const cartContainer = document.getElementById('cart-items');
  if (!cartContainer) return;
  const cart = getCart();
  cartContainer.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    const div = document.createElement('div');
    div.className = 'cart-item';
    // info container
    const infoDiv = document.createElement('div');
    infoDiv.className = 'cart-item-info';
    infoDiv.innerHTML = `<span class="cart-item-title">${item.name}</span> x ${item.quantity}<br><span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>`;
    // remove button
    const removeBtn = document.createElement('button');
    // Use a textual label instead of just a small "×" icon to improve click area and
    // accessibility. This makes it easier for users to remove items on touch devices
    // and helps avoid click‑target issues when the icon is too small.
    removeBtn.setAttribute('aria-label', 'Remove item');
    removeBtn.textContent = 'Remove';
    // Attach a click handler that calls removeFromCart with this item's ID
    removeBtn.addEventListener('click', () => {
      removeFromCart(item.id);
    });
    // append
    div.appendChild(infoDiv);
    div.appendChild(removeBtn);
    cartContainer.appendChild(div);
  });
  // update total
  const totalElement = document.getElementById('cart-total');
  if (totalElement) {
    totalElement.textContent = total.toFixed(2);
  }
  // handle empty state
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    if (totalElement) totalElement.textContent = '0.00';
  }
}

// Handle add to cart buttons
function setupAddToCartButtons() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-product-id');
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      addToCart({ id, name, price });
      btn.textContent = 'Added';
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
      }, 1000);
    });
  });
}

// Handle checkout form submission
function setupCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const cart = getCart();
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    // Simulate order placement
    localStorage.removeItem('cart');
    updateCartCount();
    renderCart();
    const messageDiv = document.getElementById('order-message');
    messageDiv.textContent = 'Thank you! Your order has been placed. A confirmation email will be sent to you shortly.';
    messageDiv.style.display = 'block';
    form.reset();
  });
}

// Initialize functions on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  setupAddToCartButtons();
  renderCart();
  setupCheckoutForm();
});