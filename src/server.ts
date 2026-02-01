import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './db.js'
import {adminBot, kvadrociklyBot, minitractoryBot, snegohodyBot} from "./bot.js";
import dotenv from "dotenv";
import snegohodyRoutes from "./api/snegohody/snegohody.routes.js";
import minitraktoryRoutes from "./api/minitraktory/minitraktory.routes.js";
import kvadrociklyRoutes from "./api/kvadrocikly/kvadrocikly.routes.js";

dotenv.config()

export const app = express()
const PORT = Number(process.env.PORT) || 3004

app.use(
  cors({
    origin: [
      '*'
      // 'http://localhost:3004',
      // 'request-manager-jcb7.onrender.com',
    ],
    // credentials: true
  })
)

app.use(express.json())

const startApp = async () => {
  await connectDB()

  kvadrociklyBot.start({
    allowed_updates: ['message', 'callback_query'],
  });
  minitractoryBot.start({
    allowed_updates: ['message', 'callback_query']
  });
  snegohodyBot.start({
    allowed_updates: ['message', 'callback_query']
  });

  adminBot.start();
}

// API
app.use('/', kvadrociklyRoutes)
app.use('/', snegohodyRoutes)
app.use('/', minitraktoryRoutes)


startApp().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})
