import asyncio
import json
import re
import aiohttp
from typing import Union, Dict, Any
from aiogram import Bot, Dispatcher, types
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo, Message
from aiogram.filters import CommandStart, Filter

# Токен вашего бота (замените на ваш токен)
TOKEN = ""
# Ваш API-ключ Steam (замените на ваш ключ)
STEAM_API_KEY = ""  # Вставьте сюда ваш ключ

bot = Bot(token=TOKEN)
dp = Dispatcher()

class WebAppDataFilter(Filter):
    async def __call__(self, message: Message, **kwargs) -> Union[bool, Dict[str, Any]]:
        if message.web_app_data:
            return dict(web_app_data=message.web_app_data)
        return False


@dp.message(CommandStart())
async def start(message: types.Message):
    web_app_url = "YOUR_WEB_APP_URL"  # URL вашего Web App
    keyboard = ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="Открыть Web App", web_app=WebAppInfo(url=web_app_url))]],
        resize_keyboard=True
    )
    await message.answer("Нажмите кнопку, чтобы открыть Web App:", reply_markup=keyboard)


@dp.message(WebAppDataFilter())
async def process_steam_id(message: types.Message, web_app_data: types.WebAppData):
    try:
        data = json.loads(web_app_data.data)
        steam_id = data.get('steamId')
        if steam_id:
            if re.fullmatch(r"\d{17}", steam_id):
                # Проверяем существование Steam ID с помощью асинхронного запроса
                exists = await exists_steam_id(steam_id)
                if exists:
                    await message.answer(f"Steam ID {steam_id} существует.")
                else:
                    await message.answer(f"Steam ID {steam_id} не найден.")
            else:
                await message.answer("Неверный формат Steam ID. Должно быть 17 цифр.")
        else:
            await message.answer("Нет данных или ошибка!")
    except (json.JSONDecodeError, KeyError):
        await message.answer("Неверный формат данных.")
    except Exception as e:
        await message.answer(f"Произошла ошибка: {e}")



async def exists_steam_id(steam_id: str) -> bool:
    async with aiohttp.ClientSession() as session:
        url = f"https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key={STEAM_API_KEY}&vanityurl={steam_id}"
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                return data.get('response', {}).get('success') == 1
            else:
                return False


async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
