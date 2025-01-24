document.addEventListener('DOMContentLoaded', () => {
    // Мобильное меню и хедер
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn') || (() => {
        const btn = document.createElement('button');
        btn.className = 'mobile-menu-btn';
        btn.innerHTML = '<span></span><span></span><span></span>';
        document.querySelector('.header__controls').prepend(btn);
        return btn;
    })();
    
    const navList = document.querySelector('.nav__list');
    if (mobileMenuBtn && navList) {
        // Обработка мобильного меню
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navList.classList.toggle('nav__list--active');
            document.body.classList.toggle('menu-open');
        });

        // Закрытие меню при клике вне
        document.addEventListener('click', (e) => {
            if (!navList.contains(e.target) && !mobileMenuBtn.contains(e.target) && navList.classList.contains('nav__list--active')) {
                navList.classList.remove('nav__list--active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        // Добавляем класс при скролле больше 100px
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        });
    }

    // Бургер-меню
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (burgerMenu && mobileNav) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });

        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.mobile-nav__link').forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                body.classList.remove('no-scroll');
            });
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!burgerMenu.contains(e.target) && !mobileNav.contains(e.target)) {
                burgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                body.classList.remove('no-scroll');
            }
        });
    }

    // Каталог: сортировка и фильтрация
    const catalogGrid = document.querySelector('.catalog__grid');
    
    if (catalogGrid) {
        const sortSelect = document.querySelector('.sort-select');
        const priceMinInput = document.querySelector('.price-range__input[name="price_min"]');
        const priceMaxInput = document.querySelector('.price-range__input[name="price_max"]');
        const sizeButtons = document.querySelectorAll('.size-filter__btn');
        
        // Сохраняем исходное состояние каталога
        const initialProducts = Array.from(catalogGrid.children).map(product => product.cloneNode(true));

        // Функция для получения цены товара
        function getProductPrice(product) {
            const priceElement = product.querySelector('.product-card__price');
            return parseInt(priceElement.textContent.replace(/[^\d]/g, ''));
        }

        // Функция для получения названия товара
        function getProductTitle(product) {
            const titleElement = product.querySelector('.product-card__title');
            return titleElement ? titleElement.textContent : '';
        }

        // Функция получения размеров товара
        function getProductSizes(product) {
            const sizesDiv = product.querySelector('.product-card__sizes');
            return sizesDiv ? sizesDiv.textContent.split(',').map(size => size.trim()) : [];
        }

        // Функция проверки соответствия товара фильтрам
        function checkProductFilters(product) {
            // Проверка категории
            const selectedCategories = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.value);
            
            const category = product.querySelector('.product-card__category').textContent.toLowerCase();
            const categoryMatch = selectedCategories.length === 0 || 
                selectedCategories.some(selectedCat => {
                    if (selectedCat === 'men') return category.includes('мужская');
                    if (selectedCat === 'women') return category.includes('женская');
                    if (selectedCat === 'accessories') return category.includes('аксессуары');
                    return false;
                });

            // Проверка цены
            const price = getProductPrice(product);
            const minPrice = priceMinInput ? parseInt(priceMinInput.value) || 0 : 0;
            const maxPrice = priceMaxInput ? parseInt(priceMaxInput.value) || Infinity : Infinity;
            const priceMatch = price >= minPrice && price <= maxPrice;

            // Проверка размеров
            const selectedSizes = Array.from(document.querySelectorAll('.size-filter__btn.active'))
                .map(btn => btn.dataset.size);
            const productSizes = getProductSizes(product);
            const sizeMatch = selectedSizes.length === 0 || 
                selectedSizes.some(size => productSizes.includes(size));

            return categoryMatch && priceMatch && sizeMatch;
        }

        // Функция фильтрации товаров
        function filterProducts() {
            catalogGrid.innerHTML = '';
            const products = initialProducts.map(product => product.cloneNode(true));
            const filteredProducts = products.filter(product => checkProductFilters(product));
            
            if (filteredProducts.length === 0 || areAllFiltersEmpty()) {
                products.forEach(product => {
                    catalogGrid.appendChild(product);
                });
                resetFilters();
            } else {
                filteredProducts.forEach(product => {
                    catalogGrid.appendChild(product);
                });
            }

            // Добавляем обработчики кликов для новых карточек
            addProductClickHandlers();
        }

        // Добавление обработчиков кликов на карточки товаров
        function addProductClickHandlers() {
            const productCards = catalogGrid.querySelectorAll('.product-card');
            productCards.forEach(card => {
                const image = card.querySelector('.product-card__image');
                if (image) {
                    image.addEventListener('click', () => {
                        window.location.href = 'product.html';
                    });
                }
            });
        }

        // Проверка, все ли фильтры пусты
        function areAllFiltersEmpty() {
            const noCategories = !document.querySelector('.filter-group input[type="checkbox"]:checked');
            const noSizes = !document.querySelector('.size-filter__btn.active');
            const noPriceMin = !priceMinInput || !priceMinInput.value;
            const noPriceMax = !priceMaxInput || !priceMaxInput.value;
            return noCategories && noSizes && noPriceMin && noPriceMax;
        }

        // Сброс фильтров
        function resetFilters() {
            document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            document.querySelectorAll('.size-filter__btn').forEach(btn => {
                btn.classList.remove('active');
            });
            if (priceMinInput) priceMinInput.value = '';
            if (priceMaxInput) priceMaxInput.value = '';
        }

        // Функция для сортировки товаров
        function sortProducts() {
            const catalogGrid = document.querySelector('.catalog__grid');
            const sortSelect = document.querySelector('.sort-select');
            if (!catalogGrid || !sortSelect) return;

            const products = Array.from(catalogGrid.querySelectorAll('.product-card:not([style*="display: none"])'));
            const sortType = sortSelect.value;

            products.sort((a, b) => {
                const priceA = getProductPrice(a);
                const priceB = getProductPrice(b);
                const titleA = getProductTitle(a);
                const titleB = getProductTitle(b);
                const isNewA = a.querySelector('.badge--new') !== null;
                const isNewB = b.querySelector('.badge--new') !== null;
                const isHitA = a.querySelector('.badge--hit') !== null;
                const isHitB = b.querySelector('.badge--hit') !== null;

                switch (sortType) {
                    case 'price-asc':
                        return priceA - priceB;
                    case 'price-desc':
                        return priceB - priceA;
                    case 'name-asc':
                        return titleA.localeCompare(titleB);
                    case 'name-desc':
                        return titleB.localeCompare(titleA);
                    case 'new':
                        return (isNewB - isNewA) || (priceB - priceA);
                    case 'popular':
                        return (isHitB - isHitA) || (priceB - priceA);
                    default:
                        return 0;
                }
            });

            // Очищаем и заново наполняем каталог
            catalogGrid.innerHTML = '';
            products.forEach(product => catalogGrid.appendChild(product));
        }

        // Обработчик изменения сортировки
        document.querySelector('.sort-select')?.addEventListener('change', sortProducts);

        // Фильтры категорий
        const categoryCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = false; // Сбрасываем начальное состояние
            checkbox.addEventListener('change', () => {
                filterProducts();
                sortProducts();
            });
        });

        // Фильтры размеров
        sizeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                filterProducts();
                sortProducts();
            });
        });

        // Фильтры цен
        let priceTimeout;
        [priceMinInput, priceMaxInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    clearTimeout(priceTimeout);
                    priceTimeout = setTimeout(() => {
                        filterProducts();
                        sortProducts();
                    }, 500);
                });
            }
        });

        // Инициализация
        filterProducts();
        sortProducts();

        // Переход на страницу товара
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const image = card.querySelector('.product-card__image');
            const button = card.querySelector('.product-card__btn');
            
            image.addEventListener('click', () => {
                const productId = card.dataset.productId || '1';
                window.location.href = `/product.html?id=${productId}`;
            });

            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                button.textContent = 'Добавлено ✓';
                button.style.background = '#2ED573';
                
                setTimeout(() => {
                    button.textContent = 'В корзину';
                    button.style.background = '';
                }, 2000);
            });
        });
    }

    // Отзывы
    const reviewsTrack = document.querySelector('.reviews__track');
    if (reviewsTrack) {
        const reviews = [
            {
                text: "Отличное качество одежды! Ношу футболки уже больше года, они как новые. Очень рад, что открыл для себя этот бренд.",
                author: "Александр Петров",
                rating: 5
            },
            {
                text: "Заказывала леггинсы для йоги, они просто идеальные! Удобные, не просвечивают, отлично тянутся. Буду заказывать еще.",
                author: "Мария Иванова",
                rating: 5
            },
            {
                text: "Быстрая доставка, отличная упаковка. Качество товаров на высоте. Особенно понравились шорты для бега.",
                author: "Дмитрий Сидоров",
                rating: 4
            },
            {
                text: "Очень стильная и качественная одежда. Приятно носить и получать комплименты. Отдельное спасибо за внимательный сервис!",
                author: "Елена Козлова",
                rating: 5
            }
        ];

        let currentReviewIndex = 0;
        const prevBtn = document.querySelector('.reviews__prev');
        const nextBtn = document.querySelector('.reviews__next');
        const dotsContainer = document.querySelector('.reviews__dots');

        // Создаем точки для слайдера
        reviews.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'reviews__dot' + (index === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                currentReviewIndex = index;
                showReview(currentReviewIndex);
            });
            dotsContainer.appendChild(dot);
        });

        function showReview(index) {
            const review = reviews[index];
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            
            const newCard = document.createElement('div');
            newCard.className = 'review-card';
            newCard.innerHTML = `
                <div class="review-card__rating">${stars}</div>
                <p class="review-card__text">${review.text}</p>
                <div class="review-card__author">${review.author}</div>
                <div class="review-card__verified">
                    <svg><use xlink:href="images/icons.svg#icon-check"></use></svg>
                    Проверенный покупатель
                </div>
            `;

            reviewsTrack.innerHTML = '';
            reviewsTrack.appendChild(newCard);
            
            // Обновляем состояние кнопок
            if (prevBtn) prevBtn.disabled = index === 0;
            if (nextBtn) nextBtn.disabled = index === reviews.length - 1;

            // Обновляем активную точку
            document.querySelectorAll('.reviews__dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            // Добавляем анимацию
            setTimeout(() => newCard.classList.add('active'), 50);
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentReviewIndex > 0) {
                    currentReviewIndex--;
                    showReview(currentReviewIndex);
                }
            });

            nextBtn.addEventListener('click', () => {
                if (currentReviewIndex < reviews.length - 1) {
                    currentReviewIndex++;
                    showReview(currentReviewIndex);
                }
            });

            // Показываем первый отзыв
            showReview(0);

            // Автоматическое переключение слайдов
            setInterval(() => {
                if (currentReviewIndex < reviews.length - 1) {
                    currentReviewIndex++;
                } else {
                    currentReviewIndex = 0;
                }
                showReview(currentReviewIndex);
            }, 5000);
        }
    }

    // Анимация появления элементов
    function animateOnScroll() {
        const elements = document.querySelectorAll('.product-card, .review-card, .feature-card');
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                element.classList.add('animate');
            }
        });
    }

    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);

    // Поиск
    const searchBtn = document.querySelector('.search-btn');
    const searchForm = document.querySelector('.search-form');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');

    if (searchBtn && searchForm && searchClose) {
        // Открытие поиска
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchForm.classList.add('active');
            document.body.classList.add('search-open');
            searchInput.focus();
        });

        // Закрытие поиска
        searchClose.addEventListener('click', () => {
            searchForm.classList.remove('active');
            document.body.classList.remove('search-open');
            searchInput.value = '';
            searchResults.innerHTML = '';
        });

        // Закрытие при клике вне поиска
        document.addEventListener('click', (e) => {
            if (!searchForm.contains(e.target) && !searchBtn.contains(e.target)) {
                searchForm.classList.remove('active');
                document.body.classList.remove('search-open');
                searchInput.value = '';
                searchResults.innerHTML = '';
            }
        });

        // Поиск товаров
        searchInput.addEventListener('input', debounce((e) => {
            const query = e.target.value.trim().toLowerCase();
            if (query.length === 0) {
                searchResults.innerHTML = '';
                return;
            }

            // Демо-данные товаров
            const products = [
                {
                    id: 1,
                    title: 'Спортивная футболка Pro',
                    price: '2 990 ₽',
                    image: 'images/products/tshirt1.jpg'
                },
                {
                    id: 2,
                    title: 'Шорты для бега',
                    price: '1 990 ₽',
                    image: 'images/products/shorts1.jpg'
                },
                {
                    id: 3,
                    title: 'Спортивный костюм',
                    price: '5 990 ₽',
                    image: 'images/products/suit1.jpg'
                },
                {
                    id: 4,
                    title: 'Спортивный топ',
                    price: '1 590 ₽',
                    image: 'images/products/top1.jpg'
                },
                {
                    id: 5,
                    title: 'Леггинсы для фитнеса',
                    price: '2 490 ₽',
                    image: 'images/products/leggings1.jpg'
                },
                {
                    id: 6,
                    title: 'Спортивная сумка',
                    price: '3 990 ₽',
                    image: 'images/products/bag1.jpg'
                }
            ];

            // Поиск по товарам
            const results = products.filter(product => {
                const words = product.title.toLowerCase().split(' ');
                return words.some(word => word.includes(query)) || product.title.toLowerCase().includes(query);
            });

            // Отображение результатов
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-empty">Ничего не найдено</div>';
                return;
            }

            searchResults.innerHTML = results.map(product => `
                <a href="product.html" class="search-result">
                    <div class="search-result__image">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="search-result__content">
                        <div class="search-result__title">${product.title}</div>
                        <div class="search-result__price">${product.price}</div>
                    </div>
                </a>
            `).join('');
        }, 300));
    }

    // Функция debounce
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Форма подписки
    const subscribeForm = document.querySelector('.subscribe__form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = subscribeForm.querySelector('input[type="email"]').value;
            if (email) {
                alert('Спасибо за подписку!');
                subscribeForm.reset();
            }
        });
    }

    // Корзина
    const cart = {
        items: [],
        
        init() {
            this.items = JSON.parse(localStorage.getItem('cart')) || [];
            this.updateCartCount();
            this.renderCart();
            this.initEventListeners();
        },

        addItem(product, size = 'M') {
            const existingItem = this.items.find(item => 
                item.id === product.id && item.size === size
            );

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                this.items.push({
                    id: product.id || Date.now().toString(),
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    size: size,
                    quantity: 1
                });
            }
            
            this.save();
            this.updateCartCount();
            this.renderCart();
        },

        removeItem(id) {
            this.items = this.items.filter(item => item.id !== id);
            this.save();
            this.updateCartCount();
            this.renderCart();
        },

        save() {
            localStorage.setItem('cart', JSON.stringify(this.items));
        },

        updateCartCount() {
            const cartCount = document.querySelector('.header__cart-count');
            if (cartCount) {
                const totalItems = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
                cartCount.textContent = totalItems;
                cartCount.style.display = totalItems > 0 ? 'block' : 'none';
            }
        },

        renderCart() {
            const cartItems = document.querySelector('.cart__items');
            const cartWrapper = document.querySelector('.cart__wrapper');
            const cartEmpty = document.querySelector('.cart__empty');
            
            if (!cartItems) return;

            if (this.items.length === 0) {
                if (cartWrapper) cartWrapper.style.display = 'none';
                if (cartEmpty) cartEmpty.style.display = 'block';
                return;
            }

            if (cartWrapper) cartWrapper.style.display = 'grid';
            if (cartEmpty) cartEmpty.style.display = 'none';

            let totalSum = 0;
            cartItems.innerHTML = this.items.map(item => {
                const price = parseInt(item.price.replace(/[^\d]/g, ''));
                const itemTotal = price * (item.quantity || 1);
                totalSum += itemTotal;
                
                return `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item__image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="cart-item__content">
                            <h3 class="cart-item__title">${item.title}</h3>
                            <div class="cart-item__info">
                                <span class="cart-item__size">Размер: ${item.size}</span>
                                <div class="cart-item__quantity">
                                    <button class="quantity-btn minus" onclick="cart.updateQuantity('${item.id}', -1)">-</button>
                                    <span class="quantity-value">${item.quantity || 1}</span>
                                    <button class="quantity-btn plus" onclick="cart.updateQuantity('${item.id}', 1)">+</button>
                                </div>
                            </div>
                            <div class="cart-item__price">${itemTotal.toLocaleString()} ₽</div>
                            <button class="cart-item__remove" onclick="cart.removeItem('${item.id}')">
                                <svg><use xlink:href="images/icons.svg#icon-close"></use></svg>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            // Обновляем итоговую сумму
            const totalElement = document.querySelector('.cart__summary-row:last-child .cart__summary-value');
            if (totalElement) {
                totalElement.textContent = totalSum.toLocaleString() + ' ₽';
            }
        },

        updateQuantity(id, change) {
            const item = this.items.find(item => item.id === id);
            if (item) {
                item.quantity = Math.max(1, (item.quantity || 1) + change);
                this.save();
                this.updateCartCount();
                this.renderCart();
            }
        },

        initEventListeners() {
            // Добавление в корзину со страницы товара
            const addToCartBtn = document.querySelector('.product__add-to-cart');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const selectedSize = document.querySelector('.size-button.active')?.dataset.size || 'M';
                    const product = {
                        id: Date.now().toString(),
                        title: document.querySelector('.product__title').textContent,
                        price: document.querySelector('.product__price').textContent,
                        image: document.querySelector('.product__slide img').src,
                        size: selectedSize
                    };

                    this.addItem(product, selectedSize);
                    
                    addToCartBtn.textContent = 'Добавлено ✓';
                    addToCartBtn.classList.add('added');
                    setTimeout(() => {
                        addToCartBtn.textContent = 'В корзину';
                        addToCartBtn.classList.remove('added');
                    }, 2000);
                });
            }

            // Добавление в корзину из каталога
            document.querySelectorAll('.product-card__btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const card = btn.closest('.product-card');
                    
                    const product = {
                        id: Date.now().toString(),
                        title: card.querySelector('.product-card__title').textContent,
                        price: card.querySelector('.product-card__price').textContent,
                        image: card.querySelector('.product-card__image img').src,
                        size: card.dataset.sizes?.split(',')[0] || 'M'
                    };

                    this.addItem(product);
                    
                    btn.textContent = 'Добавлено ✓';
                    btn.classList.add('added');
                    setTimeout(() => {
                        btn.textContent = 'В корзину';
                        btn.classList.remove('added');
                    }, 2000);
                });
            });
        }
    };

    // Инициализация корзины при загрузке страницы
    document.addEventListener('DOMContentLoaded', () => {
        cart.init();
    });

    // Класс для управления избранными товарами
    class Favorites {
        constructor() {
            this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            this.init();
        }

        init() {
            this.updateFavoriteButtons();
            this.initEventListeners();
            this.renderFavoritesPage();
        }

        toggleItem(productId) {
            const index = this.favorites.indexOf(productId);
            
            if (index === -1) {
                this.favorites.push(productId);
            } else {
                this.favorites.splice(index, 1);
            }
            
            this.save();
            this.updateFavoriteButtons();
            this.renderFavoritesPage();
        }

        save() {
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
        }

        updateFavoriteButtons() {
            // Обновляем состояние кнопок в каталоге
            document.querySelectorAll('.product-card__favorite').forEach(button => {
                const productId = button.dataset.productId;
                button.classList.toggle('active', this.favorites.includes(productId));
            });

            // Обновляем состояние кнопки на странице товара
            const productFavoriteBtn = document.querySelector('.product__favorite');
            if (productFavoriteBtn) {
                const productId = productFavoriteBtn.dataset.productId;
                productFavoriteBtn.classList.toggle('active', this.favorites.includes(productId));
            }
        }

        initEventListeners() {
            // Обработчики для кнопок в каталоге
            document.querySelectorAll('.product-card__favorite').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const productId = button.dataset.productId;
                    this.toggleItem(productId);
                });
            });

            // Предотвращаем переход по ссылке при клике на кнопку избранного
            document.querySelectorAll('.product-card__image').forEach(imageContainer => {
                const favoriteBtn = imageContainer.querySelector('.product-card__favorite');
                if (favoriteBtn) {
                    favoriteBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                }
            });

            // Обработчик для кнопки на странице товара
            const productFavoriteBtn = document.querySelector('.product__favorite');
            if (productFavoriteBtn) {
                productFavoriteBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productId = productFavoriteBtn.dataset.productId;
                    this.toggleItem(productId);
                });
            }
        }

        renderFavoritesPage() {
            const favoritesGrid = document.querySelector('.favorites__grid');
            if (!favoritesGrid) return;

            if (this.favorites.length === 0) {
                favoritesGrid.innerHTML = `
                    <div class="favorites__empty">
                        <svg class="favorites__empty-icon">
                            <use xlink:href="images/icons.svg#icon-heart"></use>
                        </svg>
                        <h3 class="favorites__empty-title">Список избранного пуст</h3>
                        <p class="favorites__empty-text">Добавляйте товары в избранное, чтобы не потерять их</p>
                        <a href="catalog.html" class="btn btn--primary">Перейти в каталог</a>
                    </div>
                `;
            }
        }
    }

    // Инициализация при загрузке страницы
    document.addEventListener('DOMContentLoaded', () => {
        // ... existing code ...
        
        // Инициализация избранного
        const favorites = new Favorites();
    });

    // Профиль
    const profileNavBtns = document.querySelectorAll('.profile__nav-btn');
    const profileTabs = document.querySelectorAll('.profile__tab');
    const favoritesGrid = document.querySelector('.favorites__grid');
    const profileForm = document.querySelector('.profile__form');
    const logoutBtn = document.querySelector('.profile__nav-btn.logout');
    
    // Табы в личном кабинете
    if (profileNavBtns.length && profileTabs.length) {
        profileNavBtns.forEach(btn => {
            if (!btn.classList.contains('logout')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Убираем активный класс у всех кнопок
                    profileNavBtns.forEach(b => {
                        if (!b.classList.contains('logout')) {
                            b.classList.remove('active');
                        }
                    });
                    
                    // Добавляем активный класс текущей кнопке
                    this.classList.add('active');
                    
                    const tabName = this.getAttribute('data-tab');
                    
                    // Показываем нужный таб
                    profileTabs.forEach(tab => {
                        tab.style.display = 'none';
                        if (tab.getAttribute('data-tab') === tabName) {
                            tab.style.display = '';
                            tab.classList.add('active');
                        } else {
                            tab.classList.remove('active');
                        }
                    });
                });
            }
        });
    }
    
    // Обработка отправки формы с личными данными
    if (profileForm) {
        // Загружаем сохраненные данные при загрузке страницы
        const savedUserData = localStorage.getItem('userData');
        if (savedUserData) {
            const userData = JSON.parse(savedUserData);
            Object.keys(userData).forEach(key => {
                const input = profileForm.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = userData[key];
                }
            });
        }

        // Сохраняем данные при отправке формы
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(profileForm);
            const userData = {};
            
            formData.forEach((value, key) => {
                userData[key] = value;
            });
            
            localStorage.setItem('userData', JSON.stringify(userData));
            alert('Данные успешно сохранены');
        });
    }
    
    // Обработка кнопки выхода
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Фильтрация товаров в каталоге
    const catalogFilter = {
        activeCategory: 'all',
        activeSort: 'default',
        
        init() {
            const categoryButtons = document.querySelectorAll('.blog-category');
            const sortSelect = document.querySelector('.sort-select');
            
            if (categoryButtons.length && sortSelect) {
                categoryButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        categoryButtons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.activeCategory = btn.dataset.category;
                        this.filterProducts();
                    });
                });
                
                sortSelect.addEventListener('change', (e) => {
                    this.activeSort = e.target.value;
                    this.filterProducts();
                });
            }
        },
        
        filterProducts() {
            const products = document.querySelectorAll('.product-card');
            
            products.forEach(product => {
                const category = product.dataset.category;
                let shouldShow = this.activeCategory === 'all' || category === this.activeCategory;
                
                product.style.display = shouldShow ? 'block' : 'none';
            });
            
            const visibleProducts = Array.from(products).filter(p => p.style.display !== 'none');
            this.sortProducts(visibleProducts);
        },
        
        sortProducts(products) {
            const productsArray = Array.from(products);
            const container = document.querySelector('.catalog__grid');
            
            if (!container) return;
            
            switch (this.activeSort) {
                case 'price-asc':
                    productsArray.sort((a, b) => {
                        const priceA = parseInt(a.dataset.price);
                        const priceB = parseInt(b.dataset.price);
                        return priceA - priceB;
                    });
                    break;
                    
                case 'price-desc':
                    productsArray.sort((a, b) => {
                        const priceA = parseInt(a.dataset.price);
                        const priceB = parseInt(b.dataset.price);
                        return priceB - priceA;
                    });
                    break;
                    
                case 'name-asc':
                    productsArray.sort((a, b) => {
                        const nameA = a.dataset.name.toLowerCase();
                        const nameB = b.dataset.name.toLowerCase();
                        return nameA.localeCompare(nameB);
                    });
                    break;
                    
                case 'name-desc':
                    productsArray.sort((a, b) => {
                        const nameA = a.dataset.name.toLowerCase();
                        const nameB = b.dataset.name.toLowerCase();
                        return nameB.localeCompare(nameA);
                    });
                    break;
            }
            
            // Очищаем и заново наполняем контейнер
            container.innerHTML = '';
            productsArray.forEach(product => {
                container.appendChild(product);
            });
        }
    };

    // Инициализация всех компонентов
    document.addEventListener('DOMContentLoaded', () => {
        // ... existing code ...
        catalogFilter.init();
    });

    // Слайдер категорий
    const categoriesSlider = {
        currentSlide: 0,
        slidesPerView: 3,
        
        init() {
            this.track = document.querySelector('.categories__track');
            this.slides = this.track.children;
            this.prevBtn = document.querySelector('.slider-btn--prev');
            this.nextBtn = document.querySelector('.slider-btn--next');
            
            if (!this.track || !this.prevBtn || !this.nextBtn) return;
            
            // Обновляем количество слайдов на экране в зависимости от ширины
            this.updateSlidesPerView();
            window.addEventListener('resize', () => this.updateSlidesPerView());
            
            // Добавляем обработчики для кнопок
            this.prevBtn.addEventListener('click', () => this.slide('prev'));
            this.nextBtn.addEventListener('click', () => this.slide('next'));
            
            // Инициализация состояния кнопок
            this.updateButtons();
        },
        
        updateSlidesPerView() {
            if (window.innerWidth <= 576) {
                this.slidesPerView = 1;
            } else if (window.innerWidth <= 991) {
                this.slidesPerView = 2;
            } else {
                this.slidesPerView = 3;
            }
            this.updateButtons();
        },
        
        slide(direction) {
            if (direction === 'prev' && this.currentSlide > 0) {
                this.currentSlide--;
            } else if (direction === 'next' && this.currentSlide < this.slides.length - this.slidesPerView) {
                this.currentSlide++;
            }
            
            const offset = this.currentSlide * (100 / this.slidesPerView);
            this.track.style.transform = `translateX(-${offset}%)`;
            
            this.updateButtons();
        },
        
        updateButtons() {
            if (this.prevBtn) {
                this.prevBtn.disabled = this.currentSlide === 0;
            }
            if (this.nextBtn) {
                this.nextBtn.disabled = this.currentSlide >= this.slides.length - this.slidesPerView;
            }
        }
    };

    // Инициализация слайдера категорий
    document.addEventListener('DOMContentLoaded', () => {
        categoriesSlider.init();
    });

    // Обработка выбора размера
    document.querySelectorAll('.size-button').forEach(button => {
        button.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок
            document.querySelectorAll('.size-button').forEach(btn => {
                btn.classList.remove('active');
            });
            // Добавляем активный класс нажатой кнопке
            button.classList.add('active');
        });
    });

    // Фильтрация статей в блоге
    const blogCategories = document.querySelectorAll('.blog-category');
    const blogCards = document.querySelectorAll('.blog-card');

    if (blogCategories.length && blogCards.length) {
        // Добавляем активный класс первой категории по умолчанию
        blogCategories[0].classList.add('active');

        blogCategories.forEach(category => {
            category.addEventListener('click', () => {
                // Убираем активный класс у всех категорий
                blogCategories.forEach(cat => cat.classList.remove('active'));
                
                // Добавляем активный класс текущей категории
                category.classList.add('active');
                
                const selectedCategory = category.dataset.category;
                
                // Показываем все статьи если выбрана категория "all"
                if (selectedCategory === 'all') {
                    blogCards.forEach(card => {
                        card.style.display = '';
                        // Добавляем анимацию
                        card.classList.add('animate');
                        setTimeout(() => card.classList.remove('animate'), 300);
                    });
                    return;
                }
                
                // Фильтруем статьи по категории
                blogCards.forEach(card => {
                    if (card.dataset.category === selectedCategory) {
                        card.style.display = '';
                        // Добавляем анимацию
                        card.classList.add('animate');
                        setTimeout(() => card.classList.remove('animate'), 300);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Загрузка данных товара на странице товара
    function loadProductData() {
        if (window.location.pathname.includes('product.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            
            // Получаем параметры из URL
            const productData = {
                title: urlParams.get('title'),
                price: urlParams.get('price'),
                sizes: urlParams.get('sizes')?.split(',') || [],
                image: urlParams.get('image')
            };

            // Проверяем, есть ли параметры в URL
            if (!productData.title || !productData.price || !productData.image) {
                console.error('Отсутствуют необходимые параметры товара');
                return;
            }

            // Заполняем данные на странице
            const titleElement = document.querySelector('.product__title');
            const priceElement = document.querySelector('.product__price');
            const imageElement = document.querySelector('.product__slide img');
            const sizeButtons = document.querySelector('.size-buttons');

            if (titleElement) {
                titleElement.textContent = productData.title;
                document.title = `${productData.title} - PIN-UP Sportswear`;
            }

            if (priceElement) {
                priceElement.textContent = `${productData.price} ₽`;
            }

            if (imageElement) {
                imageElement.src = productData.image;
                imageElement.alt = productData.title;
            }

            // Добавляем размеры
            if (sizeButtons && productData.sizes.length > 0) {
                sizeButtons.innerHTML = productData.sizes.map(size => `
                    <button class="size-button" data-size="${size}">${size}</button>
                `).join('');

                // Добавляем обработчики для кнопок размеров
                document.querySelectorAll('.size-button').forEach(button => {
                    button.addEventListener('click', () => {
                        document.querySelectorAll('.size-button').forEach(btn => {
                            btn.classList.remove('active');
                        });
                        button.classList.add('active');
                    });
                });

                // Активируем первый размер по умолчанию
                const firstSizeButton = document.querySelector('.size-button');
                if (firstSizeButton) {
                    firstSizeButton.classList.add('active');
                }
            }
        }
    }

    // Вызываем функцию при загрузке страницы
    document.addEventListener('DOMContentLoaded', loadProductData);
}); 
// Обработчик для кнопки "Добавить в корзину"
document.addEventListener('DOMContentLoaded', function() {
	const addToCartButtons = document.querySelectorAll('.product__add-to-cart');
	const favoriteButtons = document.querySelectorAll('.product__favorite');

	// Обработка кнопок "Добавить в корзину"
	addToCartButtons.forEach(button => {
			button.addEventListener('click', function() {
					// Добавляем класс added
					this.classList.add('added');
					
					// Меняем текст кнопки
					this.textContent = 'Добавлено';
					
					// Через 2 секунды возвращаем исходное состояние
					setTimeout(() => {
							this.classList.remove('added');
							this.textContent = 'Добавить в корзину';
					}, 2000);
			});
	});

	// Обработка кнопок "В избранное"
	favoriteButtons.forEach(button => {
			button.addEventListener('click', function(e) {
					e.preventDefault(); // Предотвращаем действие по умолчанию
					this.classList.toggle('active');
			});
	});
}); 
