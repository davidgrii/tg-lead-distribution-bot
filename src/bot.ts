import dotenv from 'dotenv'
import { setupAdminCommands } from './commands/admin.js'
import { Bot } from 'grammy'
import {setupMinitractoryCommands} from "./commands/minitractory.js";
import {setupKvadrociklyCommands} from "./commands/kvadrocikly.js";
import {setupSnegohodyCommands} from "./commands/snegohody.js";

dotenv.config()

const adminBotToken = process.env.ADMIN_BOT_TOKEN!

const minitractoryToken = process.env.MINITRAKKTORY_BOT_TOKEN!
const kvadrociklyToken = process.env.KVADROCIKLY_BOT_TOKEN!
const snegohodyToken = process.env.SNEGOHODY_BOT_TOKEN!

export const adminBot = new Bot(adminBotToken)

export const minitractoryBot = new Bot(minitractoryToken)
export const kvadrociklyBot = new Bot(kvadrociklyToken)
export const snegohodyBot = new Bot(snegohodyToken)

// Commands
setupMinitractoryCommands(minitractoryBot)
setupKvadrociklyCommands(kvadrociklyBot)
setupSnegohodyCommands(snegohodyBot)

setupAdminCommands(adminBot)