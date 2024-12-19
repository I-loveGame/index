document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM полностью загружен");

    const tg = window.Telegram ? window.Telegram.WebApp : null;

    if (tg) {
        tg.ready();
        console.log("WebApp API is assumed to be available.");
    } else {
        console.log("Telegram WebApp API might not be available.");
    }

    const sendButton = document.getElementById("sendButton");
    const textInput = document.getElementById("textInput");
    if (sendButton && textInput) {
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
                console.log("Введите текст");
                alert("Пожалуйста, введите текст.");
            }
        });
    }
    else
     {
        console.error("Кнопка или поле ввода не найдены");
    }
});