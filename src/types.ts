export interface IClientModel {
  name: string
  contact_method: TMessenger
  phone?: string
  telegram_username?: string
}

export interface ISpectechnikiRequest {
  'Тип_квадроцикла': string
  'Вид_двигателя': string
  'Мощность': string
  'Тип_двигателя': string
  'Трансмисиия': string
  'Какой_бюджет_вы_рассматриваете_рублей': string
  'Бренды_да_или_нет': string
  'Когда_покупка': string
  Name: string

  'Какой_мессенджер': TMessenger

  Telegram?: string
  WhatsApp?: string
  'Телефон'?: string

  Telegram_username?: string
  'Telegram_номер'?: string

  tranid: string
  formid: string
  formname: string
}

export type TMessenger = 'WhatsApp' | 'Telegram' | 'Телефон'