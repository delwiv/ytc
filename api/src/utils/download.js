import Queue from 'bull'
import ytdl from 'ytdl-core'
import fs from 'fs'
import sanitize from 'sanitize-filename'

import Video from '../models/Video.js'
import convert from './convert.js'

import { videoDir } from '../api/index.js'

const downloadQueue = new Queue('download')

export default async (url, websocket) => {
  const youtubeId = ytdl.getURLVideoID(url)
  const existing = await Video.findOne({ youtubeId })
  console.log({ existing })
  if (existing) {
    return existing
  }
  const video = await Video.create({
    url,
    youtubeId,
    status: 'queuedForDownload',
  })
  console.log({ created: video })
  await downloadQueue.add({ videoId: video._id })
  downloadQueue
    .on('progress', (job, data) => {
      console.log(youtubeId, data)
      // websocket.send({...data, step: 'downloading'})
    })
    .on('completed', async () => {
      console.log('finished')
      await video.update({ status: 'downloaded' })
      await convert(video._id)
    })
  return video
}

downloadQueue.process(async (job, done) => {
  console.log('data', job.data)
  const video = await Video.findById(job.data.videoId)
  console.log({ dlProcess: video })
  const { url } = video
  const infos = await ytdl.getInfo(url)
  console.log({ infos })
  const title = sanitize(infos.title)

  const videoFile = `${videoDir}/${title}.webm`
  await video.update({ title, videoPath: videoFile, status: 'downloading' })
  ytdl(url, { format: 'webm', filter: 'audioandvideo' })
    .on('progress', (chunkLength, downloaded, total) => {
      const progress = (downloaded / total) * 100
      job.progress(+progress.toFixed(2))
    })
    .on('finish', done)
    .pipe(fs.createWriteStream(videoFile))
})
