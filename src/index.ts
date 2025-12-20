import 'dotenv/config'
import express, {Request, Response} from 'express'
import cors from 'cors'
import {Bot, Context} from 'grammy'

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
let channelId: string = process.env.CHANNEL_PART_1!

app.post('/tilda-webhook-catalog-spectehniki', async (req: Request, res: Response) => {
  const lead = req.body

  console.log('NEW LEAD:', lead)
  console.log(req.body)

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

  await bot.api.sendMessage(channelId, message, {
    parse_mode: 'HTML'
  })

  channelId = channelId === process.env.CHANNEL_PART_1! ? process.env.CHANNEL_PART_2! : process.env.CHANNEL_PART_1!
  res.sendStatus(200)
})

bot.command('start', async (ctx: Context) => {
  return await ctx.reply('Working!')
})

const PORT = Number(process.env.PORT) || 3004
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})


bot.start()