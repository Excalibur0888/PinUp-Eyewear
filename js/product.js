document.addEventListener('DOMContentLoaded', function() {
    // Получаем параметры товара из URL
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    const price = urlParams.get('price');
    const sizes = urlParams.get('sizes')?.split(',') || [];
    const image = urlParams.get('image');
    
    // Функция обновления UI товара
    function updateProductUI() {
        if (!title || !price || !image) {
            console.error('Не все параметры товара переданы');
        return;
    }

        // Обновляем заголовок страницы
        document.title = `${title} - PIN-UP Sportswear`;

        // Обновляем основную информацию
        document.querySelector('.product__title').textContent = title;
        document.querySelector('.product__price').textContent = `${price} ₽`;

        // Обновляем изображение
        const productImage = document.querySelector('.product__slide img');
        productImage.src = image;
        productImage.alt = title;

        // Обновляем кнопки размеров
        const sizeButtons = document.querySelectorAll('.size-button');
        sizeButtons.forEach(button => {
            const size = button.dataset.size;
            if (sizes.includes(size)) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });
            }

    // Обработчики для кнопок размера
    const sizeButtons = document.querySelectorAll('.size-button');
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Обработчик добавления в корзину
    const addToCartButton = document.querySelector('.product__add-to-cart');
        addToCartButton.addEventListener('click', function() {
            if (!window.canAddToCart()) return;

        const selectedSize = document.querySelector('.size-button.active')?.dataset.size;
            if (!selectedSize) {
                alert('Пожалуйста, выберите размер');
                return;
            }

            const productData = {
            title: title,
            price: `${price} ₽`,
            size: selectedSize,
            image: image,
                quantity: 1
            };

        const user = getCurrentUser();
        let cart = getUserCart(user.id);
        
            const existingItemIndex = cart.findIndex(item => 
            item.title === productData.title && item.size === productData.size
            );

            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push(productData);
            }

            saveUserCart(user.id, cart);
        });

    // Обработчик добавления в избранное
    const favoriteButton = document.querySelector('.product__favorite');
    favoriteButton.addEventListener('click', function() {
        if (!window.canAddToFavorites()) return;

        const productData = {
            title: title,
            price: `${price} ₽`,
            image: image
        };

        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const existingItemIndex = favorites.findIndex(item => item.title === productData.title);

        if (existingItemIndex !== -1) {
            favorites.splice(existingItemIndex, 1);
            this.classList.remove('active');
        } else {
            favorites.push(productData);
            this.classList.add('active');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        });

    // Проверяем, есть ли товар в избранном при загрузке страницы
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.some(item => item.title === title)) {
        favoriteButton.classList.add('active');
    }

    // Обработчики для кнопок корзины в секции related-products
    const relatedProductButtons = document.querySelectorAll('.related-products .product-card__btn');
    relatedProductButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!window.canAddToCart()) return;

            const productCard = this.closest('.product-card');
            const productData = {
                id: parseInt(productCard.dataset.productId),
                title: productCard.querySelector('.product-card__title').textContent,
                price: productCard.querySelector('.product-card__price').textContent,
                image: productCard.querySelector('img').src,
                quantity: 1
            };

            const user = getCurrentUser();
            let cart = getUserCart(user.id);
            
            const existingItemIndex = cart.findIndex(item => item.id === productData.id);

            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push(productData);
            }

            saveUserCart(user.id, cart);

            // Визуальное подтверждение
            this.textContent = 'Добавлено ✓';
            this.classList.add('added');
            
            setTimeout(() => {
                this.textContent = 'В корзину';
                this.classList.remove('added');
            }, 2000);
        });
    });

    // Инициализируем страницу
    updateProductUI();
}); 
