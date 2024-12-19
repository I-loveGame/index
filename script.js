document.addEventListener('DOMContentLoaded', () => {
    const steamIdInput = document.getElementById('steamIdInput');
    const checkButton = document.getElementById('checkButton');
    const resultDiv = document.getElementById('result');
     const steamInfoDiv = document.getElementById('steamInfo');
    const instructionButton = document.getElementById('instructionButton');
    const backButton = document.getElementById('backButton');
    const container = document.getElementById('container');
     const instructionScreen = document.getElementById('instructionScreen');


    const tg = window.Telegram.WebApp;


     instructionButton.addEventListener('click', () => {
         container.style.transform = 'translateX(-100%)';
         instructionScreen.style.display = 'block';
          backButton.style.display = 'block';
          setTimeout(() => {
            instructionScreen.style.opacity = 1;
           }, 0)
     });

     backButton.addEventListener('click', () => {
        instructionScreen.style.opacity = 0;
           setTimeout(() => {
              container.style.transform = 'translateX(0)';
              instructionScreen.style.display = 'none';
              backButton.style.display = 'none';
          }, 300)
    });


   checkButton.addEventListener('click', () => {
        const steamId = steamIdInput.value.trim();
        if (steamId) {
            if (!/^[0-9]{17}$/.test(steamId)) {
                 resultDiv.textContent = 'Неверный формат Steam ID. Должно быть 17 цифр.';
                 return;
            }
              const data = { steamId };
               const jsonString = JSON.stringify(data);
             console.log("Данные для отправки:", jsonString);
            tg.sendData(jsonString);
            resultDiv.textContent = "Отправлено на проверку...";
            checkButton.disabled = true;
        } else {
            resultDiv.textContent = 'Введите Steam ID.';
        }
    });
});