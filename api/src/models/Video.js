import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    youtubeId: String,
    thumb: String,
    deletedAt: {
      type: Date,
      default: null,
    },
    userId: String,
    status: String,
    url: String,
    title: String,
    audioPath: String,
    videoPath: String,
  },
  {
    timestamps: true,
  }
)

const Video = mongoose.model('Video', schema)

// new Video({ youtubeId: 'test00000' }).save().then(() => Video.deleteOne({ youtubeId: 'test00000' }))

export default Video
