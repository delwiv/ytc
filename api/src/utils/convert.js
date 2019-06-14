import Queue from 'bull'
import ytdl from 'ytdl-core'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'

import Video from '../models/Video.js'
import { audioDir, videoDir } from '../api/index.js'

const convertQueue = new Queue('convert')

export default async videoId => {
  const video = await Video.findById(videoId)
  if (video.status === 'converted') return
  await video.update({
    status: 'queuedForConvert',
  })
  await convertQueue.add({ videoId })
  convertQueue
    .on('progress', (job, data) => {
      console.log(videoId, data)
      // websocket.send({...data, step: 'downloading'})
    })
    .on('error', err => {
      console.log({ err })
    })
    .on('completed', async () => {
      console.log('finished')
      await video.update({ status: 'converted' })
      // websocket.send(...)
    })
}

convertQueue.process(async (job, done) => {
  const { videoId } = job.data
  const video = await Video.findById(videoId)

  const videoFile = `${videoDir}/${videoId}.webm`
  const audioFile = `${audioDir}/${videoId}.webm`

  const inputStream = fs.createReadStream(videoFile)

  inputStream.on('error', job.error)

  await video.update({ audioPath: audioFile, status: 'converting' })
  ffmpeg(inputStream)
    .audioCodec('aac')
    .on('progress', info => {
      console.log({ info })
    })
    .on('error', job.error)
    .save(audioFile)

  ytdl(url, { format: 'webm', filter: 'audioandvideo' })
    .on('progress', (chunkLength, downloaded, total) => {
      const progress = (downloaded / total) * 100
      job.progress(+progress.toFixed(2))
    })
    .on('finish', done)
    .pipe(fs.createWriteStream(videoFile))
})
