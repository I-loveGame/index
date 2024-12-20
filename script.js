document.addEventListener('DOMContentLoaded', () => {
    const steamIdInput = document.getElementById('steamIdInput');
    const checkButton = document.getElementById('checkButton');
    const resultDiv = document.getElementById('result');
    const steamInfoDiv = document.getElementById('steamInfo');
    const instructionButton = document.getElementById('instructionButton');
    const container = document.getElementById('container');
    const instructionScreen = document.getElementById('instructionScreen');
    const instructionTab = document.getElementById('instructionTab');
    const emptyScreen = document.getElementById('emptyScreen');
    let isOpen = false;

    const tg = window.Telegram.WebApp;
    const userId = tg.initDataUnsafe?.user?.id;

    const savedData = localStorage.getItem(`steamData_${userId}`);
    let steamInfo;
    if (savedData) {
        container.style.display = 'none';
        emptyScreen.style.display = 'block';
        try {
             steamInfo = JSON.parse(localStorage.getItem(`steamInfo_${userId}`));
           if (steamInfo && steamInfo.avatar) {
              document.getElementById('avatarButton').style.backgroundImage = `url('${steamInfo.avatar}')`;
            }
         } catch (e) {
            console.error("Ошибка при разборе данных steamInfo:", e);
         }
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
             console.log("Данные для отправки:", jsonString);
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


   if (window.location.search.includes('reset=true')) {
        localStorage.removeItem(`steamData_${userId}`);
        localStorage.removeItem(`steamInfo_${userId}`);
         window.location.replace(window.location.pathname);
    }

    const avatarButton = document.getElementById('avatarButton');
    const accountInfoScreen = document.getElementById('accountInfoScreen');
    const closeAccountButton = document.getElementById('closeAccountButton');

    avatarButton.addEventListener('click', () => {
        accountInfoScreen.style.display = 'flex';
        setTimeout(() => {
            accountInfoScreen.style.transform = 'translateY(0)';
             accountInfoScreen.style.opacity = 1;
         }, 0)
    });

     closeAccountButton.addEventListener('click', () => {
        accountInfoScreen.style.transform = 'translateY(-100%)';
         accountInfoScreen.style.opacity = 0;
         setTimeout(() => {
            accountInfoScreen.style.display = 'none';
         }, 300);
    });


  function updateAccountInfo() {
      const accountName = document.getElementById('accountName');
        const realName = document.getElementById('realName');
        const accountSteamId = document.getElementById('accountSteamId');
        const accountGames = document.getElementById('accountGames');

      if (steamInfo) {
          accountName.textContent = `Имя: ${steamInfo.name || 'Неизвестно'}`;
          realName.textContent = `Реальное имя: ${steamInfo.realname || 'Неизвестно'}`;
           accountSteamId.textContent = `Steam ID: ${steamInfo.steamid || 'Неизвестно'}`;
            accountGames.textContent = `Кол-во игр: ${steamInfo.games || 'Неизвестно'}`;
        } else {
            accountName.textContent = 'Имя: Неизвестно';
            realName.textContent = 'Реальное имя: Неизвестно';
            accountSteamId.textContent = 'Steam ID: Неизвестно';
            accountGames.textContent = 'Кол-во игр: Неизвестно';
        }

    }
  updateAccountInfo();
});
