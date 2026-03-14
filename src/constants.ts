import dotenv from 'dotenv'

dotenv.config()

export const API_URL = 'https://api.coingecko.com/api'

export const TG_CHANNEL_KVADROCIKLY_URL = 'https://t.me/+lxYP7nC5ezVmZGIy'
export const TG_CHANNEL_SNEGOHODY_URL = 'https://t.me/+bD2vJs1y9AJlMjQy'
export const TG_CHANNEL_MINITRAKTORY_URL = 'https://t.me/+bD2vJs1y9AJlMjQy'

export const DATABASE_URL = process.env.DB_URL
export const ADMIN_IDS = process.env.ADMIN_IDS

export const CHANNELS_KVADROCIKLY = [
  String(process.env.CHANNEL_KVADROCIKLY_PART_1),
  String(process.env.CHANNEL_KVADROCIKLY_PART_2)
]

export const CHANNELS_SNEGOHODY = [
  String(process.env.CHANNEL_SNEGOHODY_PART_1),
  String(process.env.CHANNEL_SNEGOHODY_PART_2)
]

export const CHANNELS_MINITRAKTORY = [
  String(process.env.CHANNEL_MINITRAKKTORY_PART_1),
  String(process.env.CHANNEL_MINITRAKKTORY_PART_2)
]

// const data = {
//   Тип_квадроцикла: 'Спортивный квадроцикл',
//   Вид_двигателя: 'Бензин',
//   Мощность: '300',
//   Тип_двигателя: 'Не имеет значения, - главное надежность',
//   Трансмисиия: 'Нет, достаточно заднего привода.',
//   Какой_бюджет_вы_рассматриваете_рублей: '150000',
//   Бренды_да_или_нет: 'Нет, главное надежный.',
//   Когда_покупка: 'Через 2-3 месяца',
//   Name: 'Мокин Сергей',
//   Какой_мессенджер: 'Telegram',
//   Telegram: 'Указать номер телефона',
//   Telegram_номер: '+79920180795',
//   tranid: '14182251:8034996173',
//   formid: 'form1318360581',
//   formname: 'Подбор холодильника'
// }
