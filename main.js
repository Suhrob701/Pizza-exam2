document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('pizza-container');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');
  const goToCartButton = document.getElementById('go-to-cart');

  let allPizzas = [];
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let currentPrice = 0; // Hozirgi narx

  const API_URL = "https://run.mocky.io/v3/3bd60713-6601-4d17-a8f1-185e71b26458";

  // Pizzalarni yuklash
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      allPizzas = data.pizzas;
      renderPizzas(allPizzas);
      updateCart(); // localStorage'dan qayta yuklash
    })
    .catch(err => console.log("Xatolik: ", err));

  // Pizzalarni chiqarish
  function renderPizzas(pizzas) {
    container.innerHTML = '';
    pizzas.forEach(pizza => {
      const pizzaCard = document.createElement('div');
      pizzaCard.className = 'pizza-card';
      pizzaCard.innerHTML = `
        <img src="${pizza.imageUrl}" alt="${pizza.title}" width="200" />
        <h3>${pizza.title}</h3>
        <p>от ${pizza.price} ₽</p>
        <div class="types">
          ${pizza.types.map(type => `<button class="type-btn">${type}</button>`).join('')}
        </div>
        <div class="sizes">
          ${pizza.sizes.map(size => `<button class="size-btn">${size} см.</button>`).join('')}
        </div>
        <button class="add-btn" data-id="${pizza.id}" data-price="${pizza.price}" data-title="${pizza.title}">+ Добавить</button>
      `;
      container.appendChild(pizzaCard);
    });

    // Har bir "+" tugmasi uchun hodisa
    document.querySelectorAll('.add-btn').forEach(button => {
      button.addEventListener('click', addToCart);
    });

    // Tur va o'lcham tanlash
    document.querySelectorAll('.type-btn').forEach(button => {
      button.addEventListener('click', updatePizzaSelection);
    });
    document.querySelectorAll('.size-btn').forEach(button => {
      button.addEventListener('click', updatePizzaSelection);
    });
  }

  // Pizza turini va o'lchamini yangilash
  function updatePizzaSelection(event) {
    event.target.classList.toggle('active');

    // Tanlangan tur va o'lchamni olish
    const selectedSize = document.querySelector('.size-btn.active');
    const selectedType = document.querySelector('.type-btn.active');
    if (selectedSize && selectedType) {
      const pizzaId = event.target.closest('.pizza-card').querySelector('.add-btn').getAttribute('data-id');
      const pizzaPrice = parseInt(event.target.closest('.pizza-card').querySelector('.add-btn').getAttribute('data-price'));
      const pizzaTitle = event.target.closest('.pizza-card').querySelector('.add-btn').getAttribute('data-title');

      // Turni tanlashda qo‘shiladigan summa
      let additionalPrice = 0;
      if (selectedType.textContent === "тонкое") {
        additionalPrice = 100; // Тонкое turiga qo‘shimcha 100 ₽
      } else if (selectedType.textContent === "традиционное") {
        additionalPrice = 200; // Традиционное turiga qo‘shimcha 200 ₽
      }

      // Yangilangan narx
      currentPrice = pizzaPrice + additionalPrice;

      // Alert chiqarish
      alert(`Pizza: ${pizzaTitle}\nTur: ${selectedType.textContent}\nO'lcham: ${selectedSize.textContent}\nNarx: ${currentPrice} ₽`);

      // Savatga qo‘shish
      addToCart({ pizzaId, pizzaPrice: currentPrice, pizzaTitle, size: selectedSize.textContent, type: selectedType.textContent });

      // Tanlangan tur va o'lchamlar uchun hoverni o'chirish
      document.querySelectorAll('.type-btn.active').forEach(button => {
        button.style.pointerEvents = 'none';
      });
      document.querySelectorAll('.size-btn.active').forEach(button => {
        button.style.pointerEvents = 'none';
      });
    }
  }

  // Savatga qo‘shish
  function addToCart({ pizzaId, pizzaPrice, pizzaTitle, size, type }) {
    const index = cart.findIndex(item => item.id === pizzaId && item.size === size && item.type === type);
    if (index === -1) {
      cart.push({ id: pizzaId, price: pizzaPrice, title: pizzaTitle, size, type, quantity: 1 });
    } else {
      cart[index].quantity += 1;
    }

    updateCart();
  }

  // Savatni yangilash
  function updateCart() {
    let total = 0;
    let count = 0;

    cart.forEach(item => {
      total += item.price * item.quantity;
      count += item.quantity;
    });

    cartTotal.innerText = `${total} ₽`;
    cartCount.innerText = `${count} 🛒`;

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Filtrlash
  document.querySelectorAll('.filters button').forEach(button => {
    button.addEventListener('click', (e) => {
      const category = e.target.textContent.toLowerCase();
      let filteredPizzas = allPizzas;

      if (category !== "все") {
        filteredPizzas = allPizzas.filter(pizza => {
          if (category === "мясные" && pizza.category === 0) return true;
          if (category === "вегетарианская" && pizza.category === 1) return true;
          if (category === "гриль" && pizza.category === 2) return true;
          if (category === "острые" && pizza.category === 3) return true;
          if (category === "закрытые" && pizza.category === 4) return true;
          return false;
        });
      }

      renderPizzas(filteredPizzas);

      document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  // Tartiblash
  document.querySelector('.sort select').addEventListener('change', (e) => {
    const sortOption = e.target.value;
    let sortedPizzas = [...allPizzas];

    if (sortOption === "по цене") {
      sortedPizzas.sort((a, b) => a.price - b.price);
    } else if (sortOption === "по алфавиту") {
      sortedPizzas.sort((a, b) => a.title.localeCompare(b.title));
    }

    renderPizzas(sortedPizzas);
  });

  // Savat sahifasiga o'tish
  goToCartButton.addEventListener('click', () => {
    window.location.href = 'cart.html';
  });
});
