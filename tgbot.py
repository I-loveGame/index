import asyncio
import json
import re
import aiohttp  # Импортируем aiohttp для выполнения асинхронных HTTP-запросов
from typing import Union, Dict, Any
from aiogram import Bot, Dispatcher, types
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo, Message
from aiogram.filters import CommandStart, Filter

# Токен вашего бота (замените на ваш токен)
TOKEN = "8063894572:AAHEYweNMTJ-GaUvWXUeH4Cz0bS7uAa8h_I"
# Ваш API-ключ Steam (замените на ваш ключ)
STEAM_API_KEY = "F8A10F215FECA2977A762232DEA544F3"

# Создаем экземпляр бота и диспетчера
bot = Bot(token=TOKEN)
dp = Dispatcher()

# Фильтр для обработки данных из Web App
class WebAppDataFilter(Filter):
    async def __call__(self, message: Message, **kwargs) -> Union[bool, Dict[str, Any]]:
        if message.web_app_data:
            return dict(web_app_data=message.web_app_data)
        return False

# Обработчик команды /start
@dp.message(CommandStart())
async def start(message: types.Message):
    web_app_url = "https://i-lovegame.github.io/index/"
    keyboard = ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="Открыть Web App", web_app=WebAppInfo(url=web_app_url))]],
        resize_keyboard=True
    )
    await message.answer("Нажмите кнопку, чтобы открыть Web App:", reply_markup=keyboard)

# Обработчик данных из Web App
@dp.message(WebAppDataFilter())
async def process_steam_id(message: types.Message, web_app_data: types.WebAppData):
    try:
        data = json.loads(web_app_data.data)
        steam_id = data.get('steamId')
        if steam_id:
            if re.fullmatch(r"\d{17}", steam_id):
                # Проверка существования Steam ID
                if await exists_steam_id(steam_id):
                    await message.answer(f"Steam ID {steam_id} существует.")
                else:
                    await message.answer(f"Steam ID {steam_id} не найден.")
            else:
                await message.answer("Неверный формат Steam ID. Должно быть 17 цифр.")
        else:
            await message.answer("Нет данных или ошибка!")
    except (json.JSONDecodeError, KeyError):
        await message.answer("Неверный формат данных.")

# Функция проверки существования Steam ID
async def exists_steam_id(steam_id: str) -> bool:
    async with aiohttp.ClientSession() as session:
        # Формируем URL для запроса к Steam API
        url = f"https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key={STEAM_API_KEY}&vanityurl={steam_id}"
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                # Проверяем, существует ли Steam ID
                return data.get('response', {}).get('success') == 1
            else:
                return False  # Если запрос не удался, возвращаем False

# Основная функция для запуска бота
async def main():
    await dp.start_polling(bot)

# Запускаем основную функцию при запуске скрипта
if __name__ == "__main__":
    asyncio.run(main())