import mongoose from 'mongoose'

const { DB_URL } = process.env

mongoose.connect(DB_URL, { useNewUrlParser: true }, () => {
  console.log(`connected to ${DB_URL}`)
})

export default mongoose
