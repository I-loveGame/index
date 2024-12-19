import asyncio
import json
from typing import Union, Dict, Any
from aiogram import Bot, Dispatcher, types, F
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
from aiogram.filters import CommandStart, Filter
from aiogram.types import Message


# Токен вашего бота (замените на ваш токен)
TOKEN = "8063894572:AAHEYweNMTJ-GaUvWXUeH4Cz0bS7uAa8h_I"

bot = Bot(token=TOKEN)
dp = Dispatcher()

class WebAppDataFilter(Filter):
    async def __call__(self, message: Message, **kwargs) -> Union[bool, Dict[str, Any]]:
        return dict(web_app_data=message.web_app_data) if message.web_app_data else False

# Обработчик команды /start
@dp.message(CommandStart())
async def start(message: types.Message):
    web_app_url = "https://i-lovegame.github.io/index/"  # Замените на свой хостинг
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="Открыть Web App", web_app=WebAppInfo(url=web_app_url))]
        ],
        resize_keyboard=True
    )
    await message.answer("Нажмите кнопку ниже, чтобы открыть Web App:", reply_markup=keyboard)

# Обработчик данных из Web App
@dp.message(WebAppDataFilter())
async def handle_web_app_data(message: types.Message, web_app_data: types.WebAppData):
     print(f"Получены данные: {web_app_data.data}")
     await message.answer(f"Получены данные: {web_app_data.data}")
# Запуск бота
async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())