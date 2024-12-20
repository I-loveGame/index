document.addEventListener('DOMContentLoaded', () => {
    const steamIdInput = document.getElementById('steamIdInput');
    const checkButton = document.getElementById('checkButton');
    const resultDiv = document.getElementById('result');
    const instructionButton = document.getElementById('instructionButton');
    const container = document.getElementById('container');
    const instructionScreen = document.getElementById('instructionScreen');
    const instructionTab = document.getElementById('instructionTab');
    const emptyScreen = document.getElementById('emptyScreen');
    const userIdDisplay = document.getElementById('userIdDisplay');
    let isOpen = false;

    const tg = window.Telegram.WebApp;
    const userId = tg.initDataUnsafe?.user?.id;
    
     if(userId){
       userIdDisplay.textContent = `Вы пользователь: ${userId}`;
     }
       
    const savedData = localStorage.getItem(`steamData_${userId}`);
    if (savedData) {
      container.style.display = 'none';
      emptyScreen.style.display = 'block';
    }
      
      if (window.location.search.includes('reset=true')) {
        localStorage.removeItem(`steamData_${userId}`);
         window.location.replace(window.location.pathname);
      }
    instructionButton.addEventListener('click', () => {
        if (!isOpen) {
            container.style.transition = 'transform 0.3s ease';
            instructionTab.style.transition = 'transform 0.3s ease';
            container.style.transform = 'translateX(80%)';
            instructionTab.style.transform = 'translateX(80%)';
            instructionScreen.style.display = 'block';
            setTimeout(() => {
                instructionScreen.style.transform = 'translateX(0)';
                instructionScreen.style.opacity = 1;
            }, 0);
            isOpen = true;
        } else {
            container.style.transition = 'transform 0.3s ease';
            instructionTab.style.transition = 'transform 0.3s ease';
            instructionScreen.style.transform = 'translateX(-100%)';
            instructionScreen.style.opacity = 0;
            container.style.transform = 'translateX(0)';
            instructionTab.style.transform = 'translateX(0)';
            setTimeout(() => {
                instructionScreen.style.display = 'none';
            }, 300);
            isOpen = false;
        }
    });

    instructionScreen.addEventListener('click', (event) => {
        if (isOpen && event.target === instructionScreen) {
            container.style.transition = 'transform 0.3s ease';
            instructionTab.style.transition = 'transform 0.3s ease';
            instructionScreen.style.transform = 'translateX(-100%)';
            instructionScreen.style.opacity = 0;
            container.style.transform = 'translateX(0)';
            instructionTab.style.transform = 'translateX(0)';
            setTimeout(() => {
                instructionScreen.style.display = 'none';
            }, 300);
            isOpen = false;
        }
    });

    checkButton.addEventListener('click', async () => {
        const steamId = steamIdInput.value.trim();
        if (steamId) {
            if (!/^[0-9]{17}$/.test(steamId)) {
                resultDiv.textContent = 'Неверный формат Steam ID. Должно быть 17 цифр.';
                return;
            }
             const data = { steamId };
             const jsonString = JSON.stringify(data);
            tg.sendData(jsonString);
            localStorage.setItem(`steamData_${userId}`, JSON.stringify({ steamId: steamId }));
             resultDiv.textContent = "Отправлено на проверку...";
            checkButton.disabled = true;

            setTimeout(() => {
                container.style.display = 'none';
                emptyScreen.style.display = 'block';
            }, 1000);
        } else {
            resultDiv.textContent = 'Введите Steam ID.';
        }
    });
});
