import type {ICartLead, ILeadData} from "./types.js";
import LeadsModel from "./models/leads.model.js";
import ChannelCounterModel from "./models/channel-counter.model.js";
import ChannelCounter from "./models/channel-counter.model.js";

export const getContactMethod = (lead: Pick<ILeadData, 'Telegram' | 'Whatsapp' | 'Телефон'>) => {
  return (lead?.Telegram && 'Telegram') || (lead?.Whatsapp && 'Whatsapp') || 'Телефон'
}

export const getContactPhoneOrUsername = (lead: Pick<ILeadData, 'Telegram' | 'Whatsapp' | 'Телефон' | 'Telegram_username' | 'Telegram_номер'>) => {
  const contactPhone = (lead?.Телефон) || (lead?.Telegram_номер) || lead?.Whatsapp || ''
  const telegramUsername = lead?.Telegram_username || ''

  return {contactPhone, telegramUsername}
}

export const getNextChannel = async (
  category: 'kvadrocikly' | 'snegohody' | 'minitraktory',
  channels: string[]
) => {
  const counter = await ChannelCounter.findOneAndUpdate(
    { category },
    { $inc: { index: 1 } },
    { new: true, upsert: true }
  )

  return channels[counter.index % channels.length]
}

export const getLeadData = (lead: ILeadData) => {
  return Object.entries(lead)
    .map(([key, value], index) => {
      const formatted = `<b>${key?.at(0)?.toUpperCase() + key.slice(1)}:</b> — ${value}`
      return (index + 1) % 3 === 0 ? formatted + '\n' : formatted
    })
    .join('\n')
}

export const getCartLeadData = (lead: ICartLead) => {
  return Object.entries(lead)
    .map(([key, value], index) => {
      if (key === 'payment') return null

      const formatted = `<b>${key?.at(0)?.toUpperCase() + key.slice(1)}:</b> — ${value}`

      return (index + 1) % 3 === 0 ? formatted + '\n' : formatted
    })
    .filter(Boolean)
    .join('\n')
}

export const getCartLeadProductsData = (lead: ICartLead) => {
  if (!lead || !lead.payment) return []

  return Object.entries(lead?.payment?.products?.[0])
    .map(([key, value], index) => {
      if (key === 'img') return null

      const formatted = `<b>${key?.at(0)?.toUpperCase() + key.slice(1)}:</b> — ${key === 'price' || key === 'amount'  ? value + '₽' : value}`

      return (index + 1) % 3 === 0 ? formatted + '\n' : formatted
    })
    .filter(Boolean)
    .join('\n')
}