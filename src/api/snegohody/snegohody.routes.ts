import {Request, Response, Router} from "express";
import type {ICartLead, ISnegohodyRequest} from "../../types.js";
import ClientsModel from "../../models/client.model.js";
import {CHANNELS_SNEGOHODY} from "../../constants.js";
import {
  getCartLeadData,
  getCartLeadProductsData,
  getContactMethod,
  getContactPhoneOrUsername, getLeadData,
  getNextChannel
} from "../../utils.js";
import LeadsModel from "../../models/leads.model.js";
import {adminBot} from "../../bot.js";
import {statusKeyboard} from "../../keyboards/keyboards.js";

const router = Router();

router.post(
  '/tilda-webhook-xlkja-snegohody',
  async (req: Request, res: Response) => {
    const lead = req.body as ISnegohodyRequest
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
      category: 'snegohody',
      $or: orConditions
    })

    let channelId = duplicatedLead
      ? duplicatedLead.channel_id
      : await getNextChannel('snegohody', CHANNELS_SNEGOHODY)

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

    console.log('NEW LEAD snegohody:', lead)

    const leadData = getLeadData(lead)

    const message = `
  ❗️ <b>Получена новая заявка:</b> ❗️ 
      
${leadData}
  `

    const { message_id } = await adminBot.api.sendMessage(
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
        category: 'snegohody',

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
  '/tilda-webhook-xlkja-snegohody-cart',
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
      category: 'snegohody',
      $or: orConditions
    })

    let channelId = duplicatedLead
      ? duplicatedLead.channel_id
      : await getNextChannel('snegohody', CHANNELS_SNEGOHODY)

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

    console.log('NEW LEAD snegohody (cart):', lead)

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

    const { message_id } = await adminBot.api.sendMessage(
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
        category: 'snegohody',

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