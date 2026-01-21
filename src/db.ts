import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {DATABASE_URL} from "./constants.js";

dotenv.config()

const connectDB = async () => {
	try {
		await mongoose.connect(DATABASE_URL!)
		console.log('MongoDB connected...')
	} catch (error) {
		console.error('MongoDB connection error:', error)
		process.exit(1)
	}
}

export default connectDB
