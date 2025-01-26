document.addEventListener('DOMContentLoaded', function() {
    // Функция для отображения товаров в каталоге
    function displayProducts() {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        // Получаем все товары
        const products = window.getAllProducts();
        if (!products || !products.length) return;

        // Получаем избранные товары для текущего пользователя
        const user = getCurrentUser();
        const favorites = user ? getUserFavorites(user.id) : [];

        // Очищаем текущее содержимое
        productsGrid.innerHTML = '';

        // Добавляем каждый товар
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-card__image">
                    ${product.badges ? `
                        <div class="product-card__badges">
                            ${product.badges.map(badge => `<span class="badge badge--${badge.type}">${badge.text}</span>`).join('')}
                        </div>
                    ` : ''}
                    <a href="product.html?id=${product.id}" class="product-card__link">
                        <img src="${product.images[0]}" alt="${product.name}">
                        <div class="product-card__favorite ${favorites.some(item => item.id === product.id) ? 'active' : ''}" data-product-id="${product.id}">
                            <svg><use xlink:href="images/icons.svg#icon-heart-outline"></use></svg>
                        </div>
                    </a>
                </div>
                <div class="product-card__content">
                    <a href="product.html?id=${product.id}" class="product-card__title">${product.name}</a>
                    <div class="product-card__category">${product.category || 'Аксессуары'}</div>
                    <div class="product-card__price">${product.price}</div>
                    <a href="product.html?id=${product.id}" class="btn btn--outline product-card__btn">Подробнее</a>
                </div>
            `;

            productsGrid.appendChild(productCard);

            // Добавляем обработчик для кнопки корзины
            const cartButton = productCard.querySelector('.product-card__btn');
            cartButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (!window.canAddToCart()) return;
                
                const productId = parseInt(this.dataset.productId);
                const product = window.getProduct(productId);
                if (!product) {
                    console.error('Product not found:', productId);
                    return;
                }

                const user = getCurrentUser();
                if (!user) {
                    console.error('User not found');
                    return;
                }

                let cart = getUserCart(user.id);
                
                const productData = {
                    id: product.id,
                    title: product.name,
                    price: product.price,
                    image: product.images[0],
                    quantity: 1
                };

                const existingItemIndex = cart.findIndex(item => 
                    item.id === productData.id
                );

                if (existingItemIndex !== -1) {
                    cart[existingItemIndex].quantity += 1;
                } else {
                    cart.push(productData);
                }

                saveUserCart(user.id, cart);
                alert('Товар добавлен в корзину');
            });

            // Добавляем обработчик для кнопки избранного
            const favoriteButton = productCard.querySelector('.product-card__favorite');
            favoriteButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (!window.canAddToFavorites()) return;

                const productId = parseInt(this.dataset.productId);
                const product = window.getProduct(productId);
                if (!product) {
                    console.error('Товар не найден:', productId);
                    return;
                }

                const user = getCurrentUser();
                if (!user) {
                    console.error('Пользователь не найден');
                    return;
                }

                let favorites = getUserFavorites(user.id) || [];
                
                const productData = {
                    id: product.id,
                    title: product.name,
                    price: product.price,
                    image: product.images[0],
                    category: product.category
                };

                const existingItemIndex = favorites.findIndex(item => item.id === productData.id);

                if (existingItemIndex !== -1) {
                    favorites.splice(existingItemIndex, 1);
                    this.classList.remove('active');
                } else {
                    favorites.push(productData);
                    this.classList.add('active');
                }

                saveUserFavorites(user.id, favorites);
            });
        });
    }

    // Инициализация каталога
    displayProducts();
}); 