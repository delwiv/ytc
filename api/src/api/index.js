import fs from 'fs'
import express from 'express'

import download from '../utils/download.js'

const api = express.Router()
const { STORAGE_PATH } = process.env

export const videoDir = `${STORAGE_PATH}/video`
export const audioDir = `${STORAGE_PATH}/audio`

api.post('/video', async (req, res, next) => {
  const { url } = req.body
  console.log(url)
  if (!url) return res.status(400).json({ error: 'url-missing' })
  const video = await download(url)
  console.log({ video, url })
  res.json({ video })
})

export default () => {
  fs.promises.mkdir(videoDir, { recursive: true })
  fs.promises.mkdir(audioDir, { recursive: true })
  return api
}
