import mongoose, { Schema } from 'mongoose'
import type {IClientModel, ILeadModel} from '../types.js'

const leadSchema: Schema = new Schema({
  channel_id: { type: String, required: true },
  message_id: { type: String, required: true },

  name: { type: String, required: true },
  contact_method: { type: String, required: true },
  phone: { type: String },
  telegram_username: { type: String }
})

const LeadsModel = mongoose.model<ILeadModel>(
  'Leads',
  leadSchema,
  'leads'
)
export default LeadsModel

