import 'dotenv/config'
import express, {Request, Response} from 'express'
import cors from 'cors'
import {Bot} from 'grammy'

// const data = {
//   'Тип_квадроцикла': 'Спортивный квадроцикл',
//   'Вид_двигателя': 'Бензин',
//   'Мощность': '300',
//   'Тип_двигателя': 'Не имеет значения, - главное надежность',
//   'Трансмисиия': 'Нет, достаточно заднего привода.',
//   'Какой_бюджет_вы_рассматриваете_рублей': '150000',
//   'Бренды_да_или_нет': 'Нет, главное надежный.',
//   'Когда_покупка': 'Через 2-3 месяца',
//   Name: 'Мокин Сергей',
//   'Какой_мессенджер': 'Telegram',
//   Telegram: 'Указать номер телефона',
//   'Telegram_номер': '+79920180795',
//   tranid: '14182251:8034996173',
//   formid: 'form1318360581',
//   formname: 'Подбор холодильника'
// }

const app = express()
app.use(
  cors({
    origin: [
      '*'
    ],
  })
)

app.use(express.json())

const bot = new Bot(process.env.BOT_TOKEN!)

const CHANNELS = [
  Number(process.env.CHANNEL_PART_1),
  Number(process.env.CHANNEL_PART_2),
]

let channelIndexSpectehniki = 0
let channelIndexSnegohody = 0
let channelIndexMinitraktory = 0

app.post('/tilda-webhook-catalog-spectehniki', async (req: Request, res: Response) => {
  const lead = req.body

  console.log('NEW LEAD spectehniki:', lead)

  const leadData = Object.entries(lead)
    .map(([key, value], index) => {
      const formatted = `<b>${key?.at(0)?.toUpperCase() + key.slice(1)}:</b> — ${value}`;
      return (index + 1) % 3 === 0 ? formatted + '\n' : formatted;
    })
    .join('\n');

  const message = `
  ❗️ <b>Получена новая заявка:</b> ❗️ 
    
<b>От:</b> <code>${req.host}</code>
  
${leadData}
  `

  await bot.api.sendMessage(CHANNELS[channelIndexSpectehniki], message, {
    parse_mode: 'HTML',
  })

  channelIndexSpectehniki = (channelIndexSpectehniki + 1) % CHANNELS.length
  res.sendStatus(200)
})

app.post('/tilda-webhook-xlkja-snegohody', async (req: Request, res: Response) => {
  const lead = req.body

  console.log('NEW LEAD snegohody:', lead)

  const leadData = Object.entries(lead)
    .map(([key, value], index) => {
      const formatted = `<b>${key?.at(0)?.toUpperCase() + key.slice(1)}:</b> — ${value}`;
      return (index + 1) % 3 === 0 ? formatted + '\n' : formatted;
    })
    .join('\n');

  const message = `
  ❗️ <b>Получена новая заявка:</b> ❗️ 
    
<b>От:</b> <code>${req.host}</code>
  
${leadData}
  `

  await bot.api.sendMessage(CHANNELS[channelIndexSnegohody], message, {
    parse_mode: 'HTML',
  })

  channelIndexSnegohody = (channelIndexSnegohody + 1) % CHANNELS.length
  res.sendStatus(200)
})

app.post('/tilda-webhook-brwio-minitraktory', async (req: Request, res: Response) => {
  const lead = req.body

  console.log('NEW LEAD minitraktory:', lead)

  const leadData = Object.entries(lead)
    .map(([key, value], index) => {
      const formatted = `<b>${key?.at(0)?.toUpperCase() + key.slice(1)}:</b> — ${value}`;
      return (index + 1) % 3 === 0 ? formatted + '\n' : formatted;
    })
    .join('\n');

  const message = `
  ❗️ <b>Получена новая заявка:</b> ❗️ 
    
<b>От:</b> <code>${req.host}</code>
  
${leadData}
  `

  await bot.api.sendMessage(CHANNELS[channelIndexMinitraktory], message, {
    parse_mode: 'HTML',
  })

  channelIndexMinitraktory = (channelIndexMinitraktory + 1) % CHANNELS.length
  res.sendStatus(200)
})

// bot.command('start', async (ctx: Context) => {
//   return await ctx.reply('Working!')
// })

const PORT = Number(process.env.PORT) || 3004
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})


// bot.start()