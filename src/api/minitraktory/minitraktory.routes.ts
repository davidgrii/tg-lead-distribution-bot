import {Request, Response, Router} from "express";
import type {ICartLead, IMinitraktoryRequest} from "../../types.js";
import ClientsModel from "../../models/client.model.js";
import {minitractoryBot} from "../../bot.js";
import {CHANNELS_MINITRAKTORY} from "../../constants.js";
import {
  getCartLeadData,
  getCartLeadProductsData,
  getContactMethod,
  getContactPhoneOrUsername, getLeadData,
  getNextChannel
} from "../../utils.js";
import LeadsModel from "../../models/leads.model.js";
import {statusKeyboard} from "../../keyboards/keyboards.js";

const router = Router();

router.post(
  '/tilda-webhook-brwio-minitraktory',
  async (req: Request, res: Response) => {
    const lead = req.body as IMinitraktoryRequest
    const orConditions = []

    const contactMethod = getContactMethod(lead)
    const { contactPhone, telegramUsername } = getContactPhoneOrUsername(lead)

    if (contactPhone !== '') {
      orConditions.push({ phone: contactPhone })
    } else {
      orConditions.push({ telegram_username: telegramUsername })
    }

    const client = await ClientsModel.findOne({
      $or: orConditions
    })
    const duplicatedLead = await LeadsModel.findOne({
      category: 'minitraktory',
      $or: orConditions
    })

    let channelId = duplicatedLead
      ? duplicatedLead.channel_id
      : await getNextChannel('minitraktory', CHANNELS_MINITRAKTORY)

    if (!client) {
      await ClientsModel.create({
        name: lead.Name,
        contact_method: contactMethod,
        phone: contactPhone,
        telegram_username: telegramUsername
      })
    }

    if (duplicatedLead) {
      channelId = duplicatedLead.channel_id
    }

    console.log('NEW LEAD minitraktory:', lead)

    const leadData = getLeadData(lead)

    const message = `
  ❗️ <b>Получена новая заявка:</b> ❗️ 
      
${leadData}
  `

    const { message_id } = await minitractoryBot.api.sendMessage(
      channelId,
      message,
      {
        reply_markup: statusKeyboard,
        parse_mode: 'HTML'
      }
    )

    if (!duplicatedLead) {
      await LeadsModel.create({
        message_id: String(message_id),
        channel_id: channelId,
        category: 'minitraktory',

        name: lead.Name,
        contact_method: contactMethod,
        phone: contactPhone,
        telegram_username: telegramUsername
      })
    }

    res.sendStatus(200)
  }
)

router.post(
  '/tilda-webhook-brwio-minitraktory-cart',
  async (req: Request, res: Response) => {
    const lead = req.body as ICartLead
    const orConditions = []

    const contactMethod = getContactMethod(lead)
    const { contactPhone, telegramUsername } = getContactPhoneOrUsername(lead)

    if (contactPhone !== '') {
      orConditions.push({ phone: contactPhone })
    } else {
      orConditions.push({ telegram_username: telegramUsername })
    }

    const client = await ClientsModel.findOne({
      $or: orConditions
    })
    const duplicatedLead = await LeadsModel.findOne({
      category: 'minitraktory',
      $or: orConditions
    })

    let channelId = duplicatedLead
      ? duplicatedLead.channel_id
      : await getNextChannel('minitraktory', CHANNELS_MINITRAKTORY)

    if (!client) {
      await ClientsModel.create({
        name: lead.Name,
        contact_method: contactMethod,
        phone: contactPhone,
        telegram_username: telegramUsername
      })
    }

    if (duplicatedLead) {
      channelId = duplicatedLead.channel_id
    }

    console.log('NEW LEAD minitraktory (cart):', lead)

    const leadData = getCartLeadData(lead)
    const productsLeadData = getCartLeadProductsData(lead)

    const message = `
  ❗️ <b>Получена новая заявка:</b> ❗️ 
    
<b>Источник:</b> <code>Корзина</code>
  
${leadData}

—————————

📌 <b>О товаре:</b> 📌

${productsLeadData}

  `

    const { message_id } = await minitractoryBot.api.sendMessage(
      channelId,
      message,
      {
        reply_markup: statusKeyboard,
        parse_mode: 'HTML'
      }
    )

    if (!duplicatedLead) {
      await LeadsModel.create({
        message_id: String(message_id),
        channel_id: channelId,
        category: 'minitraktory',

        name: lead.Name,
        contact_method: contactMethod,
        phone: contactPhone,
        telegram_username: telegramUsername
      })
    }

    res.sendStatus(200)
  }
)

export default router;