import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  youtubeId: String,
  status: String,
  title: String,
  audioPath: String,
  videoPath: String,
})

export default mongoose.model('Video', schema)
