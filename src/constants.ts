import dotenv from 'dotenv'

dotenv.config()

export const TG_CHANNEL_KVADROCIKLY_URL = process.env.TG_CHANNEL_KVADROCIKLY_URL!
export const TG_CHANNEL_SNEGOHODY_URL = process.env.TG_CHANNEL_SNEGOHODY_URL!
export const TG_CHANNEL_MINITRAKTORY_URL = process.env.TG_CHANNEL_MINITRAKTORY_URL!

export const DATABASE_URL = process.env.DB_URL
export const ADMIN_IDS = process.env.ADMIN_IDS

export const CHANNELS_KVADROCIKLY = [
  String(process.env.CHANNEL_KVADROCIKLY_PART_1),
  String(process.env.CHANNEL_KVADROCIKLY_PART_2)
]

export const CHANNELS_SNEGOHODY = [
  String(process.env.CHANNEL_SNEGOHODY_PART_1),
  String(process.env.CHANNEL_SNEGOHODY_PART_2)
]

export const CHANNELS_MINITRAKTORY = [
  String(process.env.CHANNEL_MINITRAKKTORY_PART_1),
  String(process.env.CHANNEL_MINITRAKKTORY_PART_2)
]
