import mongoose, { Schema } from 'mongoose'
import type { IClientModel } from '../types.js'

const clientSchema: Schema = new Schema({
  name: { type: String, required: true },
  contact_method: { type: String, required: true },
  phone: { type: String },
  telegram_username: { type: String }
})

const ClientsModel = mongoose.model<IClientModel>(
  'Clients',
  clientSchema,
  'clients'
)
export default ClientsModel
