// Данные о товарах
const products = {
    1: {
        id: 1,
        name: 'Спортивная футболка Pro',
        price: '2 990 ₽',
        description: 'Профессиональная спортивная футболка для тренировок',
        images: ['images/tshirt1.jpg'],
        rating: 5,
        reviewsCount: 2,
        features: {
            material: '90% полиэстер, 10% эластан',
            technology: 'DryFit',
            features: 'Антибактериальная пропитка',
            season: 'Всесезон'
        }
    },
    2: {
        id: 2,
        name: 'Перчатки для фитнеса',
        price: '1 990 ₽',
        description: 'Профессиональные перчатки для фитнеса',
        images: ['images/gloves1.jpg'],
        rating: 4,
        reviewsCount: 1,
        features: {
            material: 'Натуральная кожа, неопрен',
            technology: 'GripTech',
            features: 'Усиленная защита суставов',
            season: 'Всесезон'
        }
    },
    3: {
        id: 3,
        name: 'Набор фитнес резинок',
        price: '1 290 ₽',
        description: 'Набор из 5 резинок разного уровня сопротивления',
        images: ['images/band1.jpg'],
        rating: 5,
        reviewsCount: 3,
        features: {
            material: 'Латекс премиум-класса',
            technology: 'LayerFlex',
            features: '5 уровней сопротивления',
            season: 'Всесезон'
        }
    },
    4: {
        id: 4,
        name: 'Спортивное полотенце',
        price: '890 ₽',
        description: 'Быстросохнущее спортивное полотенце',
        images: ['images/towel1.jpg'],
        rating: 5,
        reviewsCount: 1,
        features: {
            material: 'Микрофибра',
            technology: 'QuickDry',
            features: 'Антибактериальная пропитка',
            season: 'Всесезон'
        }
    }
};

// Функция для получения данных о товаре
function getProduct(id) {
    return products[id] || null;
}

// Функция для получения всех товаров
function getAllProducts() {
    return Object.values(products);
}

// Функция для поиска товаров
function searchProducts(query) {
    query = query.toLowerCase();
    return Object.values(products).filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
}

// Экспортируем функции
window.getProduct = getProduct;
window.getAllProducts = getAllProducts;
window.searchProducts = searchProducts; 