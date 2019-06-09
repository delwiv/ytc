import kue from 'kue'
import ytdl from 'ytdl-core'
import fs from 'fs'
import sanitize from 'sanitize-filename'

const { STORAGE_PATH } = process.env
const downloadDir = `${STORAGE_PATH}/videos`

const queue = kue.create()
export const enqueue = (url, websocket) => {
  const job = queue.create('download', { url })
  job
    .on('progress', data => {
      // websocket.send({...data, step: 'downloading'})
    })
    .on('complete', () => {})
}

queue.process('download', async (job, done) => {
  const { url } = job.data
  const [infos, videoId] = [await ytdl.getInfo(url), ytdl.getURLVideoID(url)]
  const videoFile = `${downloadDir}/${sanitize(infos.title)}.webm`
  console.log({ infos, videoId })
  ytdl(url, { format: 'webm', filter: 'audioandvideo' })
    .on('progress', (chunkLength, downloaded, total) => {
      console.log({ chunkLength, downloaded, total })
      job.progress({ videoId, progress: Math.round(total / downloaded, 2) })
      if (downloaded === total) {
        done(videoFile)
      }
    })
    .pipe(fs.createWriteStream(videoFile))
})
