import Queue from 'bull'
import ytdl from 'ytdl-core'
import fs from 'fs'
import sanitize from 'sanitize-filename'

import redis from '../lib/redis.js'
import Video from '../models/Video.js'
import convert from './convert.js'

import { videoDir } from '../api/index.js'

const downloadQueue = new Queue('download')

export default async ({ url, userId, websocket }) => {
  try {
    const youtubeId = ytdl.getURLVideoID(url)
    // const existing = await Video.findOne({ youtubeId, deletedAt: null })
    // console.log({ existing })
    // if (existing) {
    //   if (existing.userId !== userId) {
    //     return Video.create({ ...existing, userId })
    //   }
    //   return existing
    // }
    const video = await Video.create({
      url,
      userId,
      youtubeId,
      status: 'queuedForDownload',
    })
    await downloadQueue.add({ videoId: video._id }, { removeOnComplete: true })
    downloadQueue
      .on('progress', async (job, progress) => {
        websocket.emit('itemProgress', userId, { _id: video._id, status: 'downloading', ...progress })
      })
      .on('completed', async () => {
        console.log('finished')
        await video.update({ status: 'downloaded' })
        websocket.emit('itemProgress', userId, { _id: video._id, progress: 1, status: 'downloaded' })
        convert({ videoId: video._id, websocket })
      })
    return video
  } catch (error) {
    throw new Error('bad-url')
  }
}

downloadQueue.process(async (job, done) => {
  const video = await Video.findById(job.data.videoId)
  const { url } = video
  const infos = await ytdl.getInfo(url)
  const title = sanitize(infos.title)

  const thumb = infos.player_response.videoDetails.thumbnail.thumbnails.pop().url
  job.progress({ title, thumb })

  const videoFile = `${videoDir}/${title}.webm`
  await video.update({ title, thumb, videoPath: videoFile, status: 'downloading' })
  await redis.set(`${video._id}_progress`, 0)
  ytdl(url, { format: 'webm', filter: 'audioandvideo' })
    .on('progress', async (chunkLength, downloaded, total) => {
      const progress = downloaded / total
      const prevProgress = await redis.get(`${video._id}_progress`)
      if (+prevProgress + 0.05 <= progress) {
        await redis.set(`${video._id}_progress`, progress)
        job.progress({ progress: +progress.toFixed(2) })
      }
    })
    .on('finish', done)
    .pipe(fs.createWriteStream(videoFile))
})
