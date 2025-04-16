const cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartContainer = document.getElementById('cart-container');
const cartTotal = document.getElementById('cart-total');
const clearCartButton = document.getElementById('clear-cart');

// Render savat
function renderCart() {
  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty">Savatda hech narsa yo‘q.</p>';
    cartTotal.innerText = 'Savatdagi umumiy summa: 0 ₽';
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'cart-card';
    card.innerHTML = `
      <div class="cart-info">
        <h3>${item.title}</h3>
        <div class="options">
          <select class="type-select">
            <option ${item.dough === "тонкое" ? "selected" : ""}>тонкое</option>
            <option ${item.dough === "традиционное" ? "selected" : ""}>традиционное</option>
          </select>

          <select class="size-select">
            <option ${item.size === 26 ? "selected" : ""}>26 см.</option>
            <option ${item.size === 30 ? "selected" : ""}>30 см.</option>
            <option ${item.size === 40 ? "selected" : ""}>40 см.</option>
          </select>
        </div>
        <div class="quantity-control">
          <button class="decrease" data-index="${index}">−</button>
          <span>${item.quantity}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
        <p class="item-total">Jami: ${item.price * item.quantity} ₽</p>
      </div>
    `;
    cartContainer.appendChild(card);

    total += item.price * item.quantity;
  });

  cartTotal.innerText = `Savatdagi umumiy summa: ${total} ₽`;

  // Tugmalarni ishga tushirish
  document.querySelectorAll('.increase').forEach(btn =>
    btn.addEventListener('click', e => changeQuantity(e, 1))
  );
  document.querySelectorAll('.decrease').forEach(btn =>
    btn.addEventListener('click', e => changeQuantity(e, -1))
  );
}

// Miqdorni o‘zgartirish
function changeQuantity(event, change) {
  const index = event.target.dataset.index;
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1); // o‘chirish
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Tozalash tugmasi
clearCartButton.addEventListener('click', () => {
  cart.length = 0; // cart massivini bo'shatamiz
  localStorage.removeItem('cart');
  renderCart();
});

// Boshlanishda
renderCart();

// Tungi rejim (day/night mode)
const themeToggle = document.getElementById('toggle-theme');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Iconni o'zgartirish (oy <=> quyosh)
  if (document.body.classList.contains('dark-mode')) {
    themeToggle.textContent = '☀️'; // Quyosh rasmiga o'tish
  } else {
    themeToggle.textContent = '🌙'; // Oy rasmiga o'tish
  }
});
