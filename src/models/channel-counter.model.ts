import mongoose, { Schema } from 'mongoose'
import type {IChannelCounter} from '../types.js'

const channelCounterModel: Schema = new Schema({
  category: {type: String, required: true, enum: ['snegohody', 'kvadrocikly', 'minitraktory']},
  index: { type: Number, default: 0 },
})

const ChannelCounter = mongoose.model<IChannelCounter>(
  'ChannelCounter',
  channelCounterModel,
  'ChannelCounter'
)
export default ChannelCounter
