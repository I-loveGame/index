document.addEventListener('DOMContentLoaded', () => {
    const steamIdInput = document.getElementById('steamIdInput');
    const checkButton = document.getElementById('checkButton');
    const resultDiv = document.getElementById('result');

    const tg = window.Telegram.WebApp;

    checkButton.addEventListener('click', () => {
        const steamId = steamIdInput.value.trim();
        if (steamId) {
            if (!/^[0-9]{17}$/.test(steamId)) {
                resultDiv.textContent = 'Неверный формат Steam ID. Должно быть 17 цифр.';
                return;
            }
            // ... ваш код для отправки и проверки
            const data = { steamId };
            const jsonString = JSON.stringify(data);
            console.log('Sending:', jsonString);
            tg.sendData(jsonString);
            resultDiv.textContent = 'Отправлено на проверку...';
            checkButton.disabled = true;
        } else {
            resultDiv.textContent = 'Введите Steam ID';
        }
    });
});