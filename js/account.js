document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Функция для отображения избранных товаров
    function displayFavorites() {
        const favoritesTab = document.querySelector('.profile__tab[data-tab="favorites"]');
        const favoritesGrid = favoritesTab.querySelector('.favorites__grid');
        const favoritesEmpty = favoritesTab.querySelector('.favorites__empty');

        // Получаем избранные товары
        const favorites = getUserFavorites(user.id);

        // Проверяем наличие избранных товаров
        if (!favorites || favorites.length === 0) {
            if (favoritesGrid) favoritesGrid.style.display = 'none';
            if (favoritesEmpty) favoritesEmpty.style.display = 'flex';
            return;
        }

        // Отображаем сетку с товарами
        if (favoritesGrid) {
            favoritesGrid.style.display = 'grid';
            favoritesGrid.innerHTML = '';

            favorites.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <div class="product-card__image">
                        <a href="product.html?id=${product.id}" class="product-card__link">
                            <img src="${product.image}" alt="${product.title}">
                            <div class="product-card__favorite active" data-product-id="${product.id}">
                                <svg><use xlink:href="images/icons.svg#icon-heart"></use></svg>
                            </div>
                        </a>
                    </div>
                    <div class="product-card__content">
                        <a href="product.html?id=${product.id}" class="product-card__title">${product.title}</a>
                        <div class="product-card__category">${product.category || 'Аксессуары'}</div>
                        <div class="product-card__price">${product.price}</div>
                        <a href="product.html?id=${product.id}" class="btn btn--outline product-card__btn">Подробнее</a>
                    </div>
                `;

                favoritesGrid.appendChild(productCard);

                // Добавляем обработчик для кнопки избранного
                const favoriteButton = productCard.querySelector('.product-card__favorite');
                favoriteButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    const productId = parseInt(this.dataset.productId);
                    
                    let favorites = getUserFavorites(user.id) || [];
                    favorites = favorites.filter(item => item.id !== productId);
                    saveUserFavorites(user.id, favorites);
                    
                    displayFavorites();
                });
            });
        }

        // Скрываем сообщение о пустом списке
        if (favoritesEmpty) {
            favoritesEmpty.style.display = 'none';
        }
    }

    // Обработка переключения вкладок
    const tabButtons = document.querySelectorAll('.profile__nav-btn:not(.logout)');
    const tabs = document.querySelectorAll('.profile__tab');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Переключаем вкладки
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));

            this.classList.add('active');
            document.querySelector(`.profile__tab[data-tab="${tabName}"]`).classList.add('active');

            // Если переключились на вкладку избранного, обновляем список
            if (tabName === 'favorites') {
                displayFavorites();
            }
        });
    });

    // Инициализация избранного при загрузке страницы
    displayFavorites();

    // Заполняем форму профиля данными пользователя
    const profileForm = document.querySelector('.profile__form');
    if (profileForm) {
        profileForm.first_name.value = user.first_name || '';
        profileForm.last_name.value = user.last_name || '';
        profileForm.email.value = user.email || '';
        profileForm.phone.value = user.phone || '';
        profileForm.birth_date.value = user.birth_date || '';
        profileForm.gender.value = user.gender || 'male';

        // Обработка сохранения профиля
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const users = getUsers();
            const updatedUser = {
                ...user,
                first_name: this.first_name.value,
                last_name: this.last_name.value,
                email: this.email.value,
                phone: this.phone.value,
                birth_date: this.birth_date.value,
                gender: this.gender.value,
                updatedAt: new Date().toISOString()
            };

            // Обновляем пользователя в списке всех пользователей
            const userIndex = users.findIndex(u => u.id === user.id);
            users[userIndex] = updatedUser;
            saveUsers(users);

            // Обновляем данные текущего пользователя
            setCurrentUser(updatedUser);
            alert('Профиль успешно обновлен');
        });
    }

    // Обработка кнопки выхода
    const logoutBtn = document.querySelector('.profile__nav-btn.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Обработка добавления адреса
    const addAddressBtn = document.getElementById('addAddressBtn');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', function() {
            // Здесь можно добавить модальное окно или форму для добавления адреса
            alert('Функционал добавления адреса находится в разработке');
        });
    }
}); 