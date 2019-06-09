import fs from 'fs'
import express from 'express'
import ytdl from 'ytdl-core'
import sanitize from 'sanitize-filename'

const api = express.Router()
const { STORAGE_PATH } = process.env
const downloadDir = `${STORAGE_PATH}/videos`

api.post('/video', async (req, res, next) => {
  console.log(req.body)
  const { url } = req.body
  const [infos, videoId] = [await ytdl.getInfo(url), ytdl.getURLVideoID(url)]
  console.log({ infos, videoId })
  ytdl(url, { format: 'webm', filter: 'audioandvideo' })
    .on('progress', (chunkLength, dowloaded, total) => {
      console.log({ chunkLength, dowloaded, total })
    })
    .pipe(fs.createWriteStream(`${downloadDir}/${sanitize(infos.title)}.webm`))

  res.json({ videoId })
})

export default () => {
  fs.promises.mkdir(downloadDir, { recursive: true })
  return api
}
