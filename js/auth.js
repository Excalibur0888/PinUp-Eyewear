// Функции для работы с localStorage
const AUTH_KEY = 'pinup_auth';
const USERS_KEY = 'pinup_users';
const CART_KEY = 'pinup_cart_';
const FAVORITES_KEY = 'favorites';

// Глобальные функции для проверки авторизации
window.canAddToCart = function() {
    if (!isAuthenticated()) {
        redirectToLogin();
        return false;
    }
    return true;
}

window.canAddToFavorites = function() {
    if (!isAuthenticated()) {
        redirectToLogin();
        return false;
    }
    return true;
}

window.canAccessCart = function() {
    if (!isAuthenticated()) {
        redirectToLogin();
        return false;
    }
    return true;
}

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
}

function setCurrentUser(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

// Функции для работы с корзиной
function getUserCart(userId) {
    return JSON.parse(localStorage.getItem(CART_KEY + userId) || '[]');
}

function saveUserCart(userId, cart) {
    localStorage.setItem(CART_KEY + userId, JSON.stringify(cart));
}

function clearUserCart(userId) {
    localStorage.removeItem(CART_KEY + userId);
}

// Функции для работы с избранным
function getUserFavorites(userId) {
    const favorites = localStorage.getItem(`favorites_${userId}`);
    const parsedFavorites = favorites ? JSON.parse(favorites) : [];
    return parsedFavorites;
}

function saveUserFavorites(userId, favorites) {
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
}

function clearUserFavorites(userId) {
    localStorage.removeItem(FAVORITES_KEY + '_' + userId);
}

function logout() {
    const user = getCurrentUser();
    if (user) {
        // Очищаем все данные пользователя
        clearUserCart(user.id);
        clearUserFavorites(user.id);
        localStorage.removeItem(AUTH_KEY);
    }
    window.location.href = 'login.html';
}

// Проверка авторизации
function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Перенаправление на страницу входа
function redirectToLogin() {
    window.location.href = 'login.html';
}

// Обработка формы регистрации
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = this.name.value;
        const email = this.email.value;
        const password = this.password.value;
        const confirmPassword = this.confirmPassword.value;

        // Валидация
        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        const users = getUsers();
        
        // Проверка существования пользователя
        if (users.some(user => user.email === email)) {
            alert('Пользователь с таким email уже существует');
            return;
        }

        // Создание нового пользователя
        const newUser = {
            id: Date.now(),
            name,
            email,
            password, // В реальном проекте пароль нужно хешировать
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        // Создаем пустую корзину для нового пользователя
        saveUserCart(newUser.id, []);

        // Автоматический вход после регистрации
        setCurrentUser(newUser);
        window.location.href = 'account.html';
    });
}

// Обработка формы входа
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = this.email.value;
        const password = this.password.value;

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            setCurrentUser(user);
            window.location.href = 'account.html';
        } else {
            alert('Неверный email или пароль');
        }
    });
}

// Проверка авторизации на защищенных страницах
function checkAuth() {
    const protectedPages = ['account.html', 'cart.html'];
    const currentPath = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPath) && !isAuthenticated()) {
        redirectToLogin();
        return false;
    }
    return true;
}

// Обработка кнопок, требующих авторизации
function handleAuthButtons() {
    // Обработка кнопок корзины
    const addToCartButtons = document.querySelectorAll('.product__add-to-cart, .product-card__btn');
    addToCartButtons.forEach(button => {
        const originalClick = button.onclick; // Сохраняем оригинальный обработчик
        button.onclick = function(e) {
            if (!canAddToCart()) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };
    });

    // Обработка кнопок избранного
    const favoriteButtons = document.querySelectorAll('.product__favorite, .product-card__favorite');
    favoriteButtons.forEach(button => {
        const originalClick = button.onclick; // Сохраняем оригинальный обработчик
        button.onclick = function(e) {
            if (!canAddToFavorites()) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };
    });

    // Обработка ссылок на корзину
    const cartLinks = document.querySelectorAll('a[href="cart.html"]');
    cartLinks.forEach(link => {
        link.onclick = function(e) {
            if (!canAccessCart()) {
                e.preventDefault();
                return false;
            }
        };
    });

    // Удаляем все остальные обработчики событий с этих кнопок, если пользователь не авторизован
    if (!isAuthenticated()) {
        addToCartButtons.forEach(button => {
            button.classList.remove('added');
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            newButton.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                redirectToLogin();
                return false;
            };
        });

        favoriteButtons.forEach(button => {
            button.classList.remove('active');
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            newButton.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                redirectToLogin();
                return false;
            };
        });
    }
}

// Обновление UI в зависимости от статуса авторизации
function updateAuthUI() {
    const user = getCurrentUser();
    const authLinks = document.querySelectorAll('.auth-links');

    authLinks.forEach(container => {
        if (user) {
            container.innerHTML = `
                <span class="user-name">${user.name}</span>
                <button onclick="logout()" class="btn-link">Выйти</button>
            `;
        } else {
            container.innerHTML = `
                <a href="login.html">Войти</a>
                <a href="register.html">Регистрация</a>
            `;
        }
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    handleAuthButtons();
    updateAuthUI();
}); 