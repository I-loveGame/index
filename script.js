const container = document.getElementById('container');
  const instructionScreen = document.getElementById('instructionScreen');
  const instructionTab = document.getElementById('instructionTab');
   const emptyScreen = document.getElementById('emptyScreen');
  const emptyScreen = document.getElementById('emptyScreen');
  let isOpen = false;

  const tg = window.Telegram.WebApp;
  const userId = tg.initDataUnsafe?.user?.id;

   const savedData = localStorage.getItem(`steamData_${userId}`);
      if (savedData) {
          container.style.display = 'none';
        emptyScreen.style.display = 'block';
     }
  const savedData = localStorage.getItem(`steamData_${userId}`);
  if (savedData) {
      container.style.display = 'none';
      emptyScreen.style.display = 'block';
  }

   instructionButton.addEventListener('click', () => {
       if (!isOpen) {
  instructionButton.addEventListener('click', () => {
      if (!isOpen) {
          container.style.transition = 'transform 0.3s ease';
            instructionTab.style.transition = 'transform 0.3s ease';
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
              instructionScreen.style.display = 'none';
          }, 300);
          isOpen = false;
       }
   });
      }
  });

    instructionScreen.addEventListener('click', (event) => {
  instructionScreen.addEventListener('click', (event) => {
      if (isOpen && event.target === instructionScreen) {
        container.style.transition = 'transform 0.3s ease';
         instructionTab.style.transition = 'transform 0.3s ease';
           instructionScreen.style.transform = 'translateX(-100%)';
         instructionScreen.style.opacity = 0;
         container.style.transform = 'translateX(0)';
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
          setTimeout(() => {
              instructionScreen.style.display = 'none';
          }, 300);
          isOpen = false;
      }
  });

  checkButton.addEventListener('click', () => {
      const steamId = steamIdInput.value.trim();
      if (steamId) {
@@ -75,15 +71,21 @@ document.addEventListener('DOMContentLoaded', () => {
          const jsonString = JSON.stringify(data);
          console.log("Данные для отправки:", jsonString);
          tg.sendData(jsonString);
           localStorage.setItem(`steamData_${userId}`, JSON.stringify({ steamId: steamId }));
          localStorage.setItem(`steamData_${userId}`, JSON.stringify({ steamId: steamId }));
          resultDiv.textContent = "Отправлено на проверку...";
          checkButton.disabled = true;
           setTimeout(() => {
               container.style.display = 'none';
          setTimeout(() => {
              container.style.display = 'none';
              emptyScreen.style.display = 'block';
           }, 1000);
          }, 1000);
      } else {
          resultDiv.textContent = 'Введите Steam ID.';
      }
  });
  // Проверяем наличие команды reset в URL
 if (window.location.search.includes('reset=true')) {
   localStorage.removeItem(`steamData_${userId}`);
     window.location.replace(window.location.pathname);
}
});
