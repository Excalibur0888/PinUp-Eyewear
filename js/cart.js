document.addEventListener('DOMContentLoaded', function() {
    if (!window.canAccessCart()) return;

    const cartItemsContainer = document.querySelector('.cart__items');
    const cartWrapper = document.querySelector('.cart__wrapper');
    const cartEmpty = document.querySelector('.cart__empty');
    const cartSummaryCount = document.querySelector('.cart__summary-count');
    const cartSummarySubtotal = document.querySelector('.cart__summary-subtotal');
    const cartSummaryTotal = document.querySelector('.cart__summary-total');
    const checkoutButton = document.querySelector('.cart__checkout');

    function updateCart() {
        const user = getCurrentUser();
        const cart = getUserCart(user.id);
        
        if (cart.length === 0) {
            cartWrapper.style.display = 'none';
            cartEmpty.style.display = 'flex';
            return;
        }

        cartWrapper.style.display = 'grid';
        cartEmpty.style.display = 'none';

        // Очищаем контейнер товаров
        cartItemsContainer.innerHTML = '';

        let totalItems = 0;
        let subtotal = 0;

        // Добавляем каждый товар
        cart.forEach((item, index) => {
            const price = parseInt(item.price.replace(/[^\d]/g, ''));
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;
            totalItems += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item__image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item__info">
                    <h3 class="cart-item__title">${item.title}</h3>
                    <div class="cart-item__price">${item.price}</div>
                </div>
                <div class="cart-item__quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
                <button class="cart-item__remove" data-index="${index}">
                    <svg><use xlink:href="images/icons.svg#icon-close"></use></svg>
                </button>
            `;

            cartItemsContainer.appendChild(cartItem);

            // Добавляем обработчик для кнопки удаления
            const removeButton = cartItem.querySelector('.cart-item__remove');
            removeButton.addEventListener('click', function() {
                cart.splice(index, 1);
                saveUserCart(user.id, cart);
                updateCart();
            });

            // Добавляем обработчики для кнопок количества
            const minusButton = cartItem.querySelector('.minus');
            const plusButton = cartItem.querySelector('.plus');

            minusButton.addEventListener('click', function() {
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    saveUserCart(user.id, cart);
                    updateCart();
                }
            });

            plusButton.addEventListener('click', function() {
                cart[index].quantity++;
                saveUserCart(user.id, cart);
                updateCart();
            });
        });

        // Обновляем итоги
        cartSummaryCount.textContent = totalItems;
        cartSummarySubtotal.textContent = `${subtotal} ₽`;
        cartSummaryTotal.textContent = `${subtotal} ₽`;
    }

    // Обработчик оформления заказа
    checkoutButton.addEventListener('click', function() {
        alert('Функция оформления заказа будет добавлена позже');
    });

    // Инициализация корзины
    updateCart();
}); 