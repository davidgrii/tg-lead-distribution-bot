import 'dotenv/config'
import express, {Request, Response} from 'express'
import cors from 'cors'
import {Bot, Context} from 'grammy'

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

app.post('/tilda-webhook-catalog-spectehniki', async (req: Request, res: Response) => {
  const lead = req.body

  console.log('NEW LEAD:', lead)
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

  await bot.api.sendMessage('1422316270', message, {
    parse_mode: 'HTML'
  })

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