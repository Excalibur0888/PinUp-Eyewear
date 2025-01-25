document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('chatButton');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    // Открытие/закрытие чата
    chatButton.addEventListener('click', () => {
        chatWindow.classList.add('active');
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Отправка сообщений
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Добавляем сообщение пользователя
            const userMessage = document.createElement('div');
            userMessage.className = 'message user';
            userMessage.textContent = message;
            chatMessages.appendChild(userMessage);

            // Очищаем поле ввода
            chatInput.value = '';

            // Прокручиваем к последнему сообщению
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Имитация ответа поддержки через 1 секунду
            setTimeout(() => {
                const supportMessage = document.createElement('div');
                supportMessage.className = 'message support';
                supportMessage.textContent = 'Спасибо за ваше сообщение! Наш оператор скоро с вами свяжется.';
                chatMessages.appendChild(supportMessage);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    }

    // Обработка отправки по кнопке
    chatSend.addEventListener('click', sendMessage);

    // Обработка отправки по Enter
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 