import asyncio
import json
import re
import aiohttp
from typing import Union, Dict, Any
from aiogram import Bot, Dispatcher, types
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo, Message
from aiogram.filters import CommandStart, Filter

# Токен вашего бота (замените на ваш токен)
TOKEN = "8063894572:AAHEYweNMTJ-GaUvWXUeH4Cz0bS7uAa8h_I"
# Ваш API-ключ Steam (замените на ваш ключ)
STEAM_API_KEY = "F8A10F215FECA2977A762232DEA544F3"  # Вставьте сюда ваш ключ

bot = Bot(token=TOKEN)
dp = Dispatcher()
DATA_FILE = 'steam_data.json'

class WebAppDataFilter(Filter):
    async def __call__(self, message: Message, **kwargs) -> Union[bool, Dict[str, Any]]:
        if message.web_app_data:
            return dict(web_app_data=message.web_app_data)
        return False


@dp.message(CommandStart())
async def start(message: types.Message):
    web_app_url = "https://i-lovegame.github.io/index/"  # URL вашего Web App
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
        user_id = message.from_user.id
        if steam_id:
            if re.fullmatch(r"\d{17}", steam_id):
                # Проверяем существование Steam ID с помощью асинхронного запроса
                exists = await exists_steam_id(steam_id)
                if exists:
                  await save_steam_data(user_id, steam_id)
                  steam_info = await get_steam_user_info(steam_id)
                  if steam_info:
                    name = steam_info.get('name', 'неизвестно')
                    avatar = steam_info.get('avatar', 'неизвестно')
                    games = steam_info.get('games', 0)
                    await message.answer(f"Steam ID {steam_id} существует.\n\nИмя: {name}\nИгр: {games}\nАватар: {avatar}")
                  else:
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


async def save_steam_data(user_id: int, steam_id: str):
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        data = {}
    data[user_id] = steam_id
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)


async def read_steam_data():
     try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
     except (FileNotFoundError, json.JSONDecodeError):
       return {}
     return data

async def get_steam_user_info(steam_id: str) -> Union[dict, None]:
      async with aiohttp.ClientSession() as session:
        url = f"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={STEAM_API_KEY}&steamids={steam_id}"
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                players = data.get('response', {}).get('players', [])
                if players:
                  player = players[0]
                  url2 = f"https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key={STEAM_API_KEY}&steamid={steam_id}&format=json"
                  async with session.get(url2) as response2:
                     if response2.status == 200:
                          data2 = await response2.json()
                          games = data2.get("response",{}).get("game_count")
                          return {
                            "name": player.get('personaname', 'unknown'),
                            "avatar": player.get('avatarfull', 'unknown'),
                            "games": games
                           }
                     else:
                          return {
                               "name": player.get('personaname', 'unknown'),
                            "avatar": player.get('avatarfull', 'unknown'),
                           }
                else:
                     return None
            else:
                return None


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
