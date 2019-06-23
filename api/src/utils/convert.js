import Queue from 'bull'
import ffmpeg from 'fluent-ffmpeg'

import redis from '../lib/redis.js'
import Video from '../models/Video.js'
import { audioDir } from '../api/index.js'

const convertQueue = new Queue('convert')

export default async ({ videoId, websocket }) => {
  console.log('Convert', { videoId })
  const video = await Video.findById(videoId)
  if (video.status === 'converted') return
  const { userId } = video
  await video.update({
    status: 'queuedForConvert',
  })
  websocket.emit('itemProgress', userId, { _id: videoId, status: 'queuedForConvert' })
  await convertQueue.add({ videoId }, { removeOnComplete: true })
  convertQueue
    .on('progress', (job, progress) => {
      websocket.emit('itemProgress', userId, { _id: videoId, status: 'converting', ...progress })
    })
    .on('error', err => {
      console.log({ err })
    })
    .on('completed', async () => {
      console.log('finished')
      await video.update({ status: 'converted' })
      websocket.emit('itemProgress', userId, { _id: videoId, progress: 1, status: 'converted' })
    })
}

convertQueue.process(async (job, done) => {
  const { videoId } = job.data
  const video = await Video.findById(videoId)
  const { videoPath, title } = video

  const audioFile = `${audioDir}/${title}.m4a`

  await video.update({ audioPath: audioFile, status: 'converting' })
  await redis.set(`${video._id}_progress`, 0)

  ffmpeg(videoPath)
    .noVideo()
    .audioQuality(5)
    .audioCodec('aac')
    .on('progress', async info => {
      const progress = info.percent / 100
      const prevProgress = await redis.get(`${video._id}_progress`)
      if (+prevProgress + 0.005 <= progress) {
        await redis.set(`${video._id}_progress`, progress)
        job.progress({ progress: +progress.toFixed(2) })
      }
    })
    .on('error', err => {
      console.log({ err })
    })
    .on('end', done)
    .save(audioFile)
})
