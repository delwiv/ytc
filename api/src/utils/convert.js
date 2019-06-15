import Queue from 'bull'
import ffmpeg from 'fluent-ffmpeg'

import Video from '../models/Video.js'
import { audioDir, videoDir } from '../api/index.js'

const convertQueue = new Queue('convert')

export default async videoId => {
  console.log('Convert', { videoId })
  const video = await Video.findById(videoId)
  console.log({ video })
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
  console.log({ process: videoId })
  const video = await Video.findById(videoId)
  console.log({ videoId, video })
  const { videoPath, title } = video

  const audioFile = `${audioDir}/${title}.m4a`

  await video.update({ audioPath: audioFile, status: 'converting' })

  ffmpeg(videoPath)
    .noVideo()
    .audioQuality(5)
    .audioCodec('aac')
    .on('progress', info => {
      console.log({ info })
      job.progress(+info.percent.toFixed(2))
    })
    .on('error', err => {
      console.log({ err })
    })
    .on('end', done)
    .save(audioFile)
})
