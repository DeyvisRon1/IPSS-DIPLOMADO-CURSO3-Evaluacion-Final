import mongoose from 'mongoose'
import dns from 'node:dns'
import 'dotenv/config'

dns.setServers(['8.8.8.8', '8.8.4.4'])

const MONGODB_URI = process.env.MONGODB_URI

export const conectar = async () => {
  try {
    await mongoose.connect(MONGODB_URI)

    console.log(
      `🍃 conectado a MongoDB → base "${mongoose.connection.name}"`
    )
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message)
  }
}