import mongoose, { Schema } from 'mongoose'
import type { IClientModel } from '../types.js'

const leadSchema: Schema = new Schema({
  name: { type: String, required: true },
  contact_method: { type: String, required: true },
  phone: { type: String },
  telegram_username: { type: String }
})

const LeadsModel = mongoose.model<IClientModel>(
  'Clients',
  leadSchema,
  'clients'
)
export default LeadsModel
