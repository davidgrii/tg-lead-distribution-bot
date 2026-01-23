import dotenv from 'dotenv'
import { setupAdminCommands } from './commands/admin.js'
import { Bot } from 'grammy'
import {setupStartCommands} from "./commands/start.js";

dotenv.config()

const token = process.env.BOT_TOKEN

export const bot = new Bot(token!)

// Commands
setupStartCommands(bot)
setupAdminCommands(bot)