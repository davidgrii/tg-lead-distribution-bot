import type {ILeadData} from "./types.js";

export const getContactMethod = (lead: Pick<ILeadData, 'Telegram' | 'Whatsapp' | 'Телефон'>) => {
  return (lead?.Telegram && 'Telegram') || (lead?.Whatsapp && 'Whatsapp') || 'Телефон'
}

export const getContactPhoneOrUsername = (lead: Pick<ILeadData, 'Telegram' | 'Whatsapp' | 'Телефон' | 'Telegram_username' | 'Telegram_номер'>) => {
  const contactPhone = (lead?.Телефон) || (lead?.Telegram_номер) || lead?.Whatsapp || ''
  const telegramUsername = lead?.Telegram_username || ''

  return { contactPhone, telegramUsername}
}