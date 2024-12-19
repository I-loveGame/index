document.addEventListener('DOMContentLoaded', () => {
    const steamIdInput = document.getElementById('steamIdInput');
    const checkButton = document.getElementById('checkButton');
    const resultDiv = document.getElementById('result');
    const steamInfoDiv = document.getElementById('steamInfo');
    const confirmButton = document.getElementById('confirmButton');
    const tg = window.Telegram.WebApp;

    checkButton.addEventListener('click', async () => {
        const steamId = steamIdInput.value.trim();
        if (steamId) {
            if (!/^[0-9]{17}$/.test(steamId)) {
                resultDiv.textContent = 'Неверный формат Steam ID. Должно быть 17 цифр.';
                return;
            }
            resultDiv.textContent = "Загрузка информации об аккаунте...";
            try {
                 const response = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=F8A10F215FECA2977A762232DEA544F3&steamids=${steamId}`);
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                 }

                const data = await response.json();
                 if (data && data.response && data.response.players && data.response.players.length > 0) {
                    const player = data.response.players[0];
                    steamInfoDiv.innerHTML = `
                         <img src="${player.avatarfull}" alt="Аватарка">
                         <p>Имя: ${player.personaname}</p>
                         <p>Steam ID: ${player.steamid}</p>
                        <p>Это ваш аккаунт?</p>
                    `;
                    confirmButton.style.display = 'block';
                    resultDiv.textContent = ""; //очищаем сообщение
                } else {
                  resultDiv.textContent = 'Аккаунт не найден';
                  steamInfoDiv.innerHTML = "";
                  confirmButton.style.display = "none";

                 }
            }  catch (error) {
                 resultDiv.textContent = `Ошибка получения данных: ${error.message}`
                 console.error('Ошибка получения данных:', error);
                steamInfoDiv.innerHTML = "";
                confirmButton.style.display = "none";
           }
        } else {
             resultDiv.textContent = 'Введите Steam ID.';
        }
    });

     confirmButton.addEventListener('click', () => {
        const steamId = steamIdInput.value.trim();
        const data = { steamId: steamId };
        const jsonString = JSON.stringify(data);
        console.log('Sending data:', jsonString);
        tg.sendData(jsonString);
        resultDiv.textContent = "Отправлено!";
        confirmButton.style.display = 'none';
        checkButton.disabled = true;
    });
});