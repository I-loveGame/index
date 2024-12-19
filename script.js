document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM полностью загружен");

    const tg = window.Telegram ? window.Telegram.WebApp : null;

    if (tg) {
        tg.ready();
        console.log("WebApp API is assumed to be available.");
    } else {
         console.log("Telegram WebApp API might not be available");
    }

    const sendButton = document.getElementById("sendButton");
    const textInput = document.getElementById("textInput");
    if (sendButton) {
       sendButton.addEventListener("click", () => {
            console.log("Кнопка 'Отправить' нажата.");
            const text = textInput.value.trim();
            if (text) {
                const data = { text: text };
                const jsonString = JSON.stringify(data);
                if (tg) {
                    tg.sendData(jsonString);
                    console.log("Отправлены данные:", jsonString);
                } else {
                    console.log("Telegram WebApp API is not available.");
                }
            } else {
                alert("Пожалуйста, введите текст.");
            }
        });
    } else {
        console.log("Кнопка 'Отправить' не найдена!");
    }

     if (!textInput) {
         console.log("Поле ввода не найдено")
     }
});