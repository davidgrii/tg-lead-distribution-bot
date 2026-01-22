export interface IClientModel {
  name: string
  contact_method: TMessenger
  phone?: string
  telegram_username: string
}

export interface ISpectechnikiRequest extends ILeadData{
  Тип_квадроцикла: string
  Вид_двигателя: string
  Мощность: string
  Тип_двигателя: string
  Трансмисиия: string
  Какой_бюджет_вы_рассматриваете_рублей: string
  Бренды_да_или_нет: string
}

export interface ISnegohodyRequest extends ILeadData {
  Тип: string
  Объем_двигателя_куб_: string
  Коробка: string
  Доп_опции: string
  Бюджет: string
  Бренды_да_или_нет: string
}

export interface IMinitraktoryRequest extends ILeadData {
  Вид_работ: string
  Мощность_ЛС: string
  Привод: string
  Кабина: string
  Бюджет: string
  Бренды_да_или_нет: string
}

export interface ILeadData {
  Когда_покупка: string
  Name: string

  Какой_мессенджер: TMessenger

  Telegram?: string
  Whatsapp?: string
  Телефон?: string

  Telegram_username?: string
  Telegram_номер?: string

  tranid: string
  formid: string
  formname: string
}

export type TMessenger = 'Whatsapp' | 'Telegram' | 'Телефон'
