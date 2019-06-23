import fs from 'fs'
import express from 'express'

import download from '../utils/download.js'
import Video from '../models/Video.js'

const api = express.Router()
const { STORAGE_PATH } = process.env

export const videoDir = `${STORAGE_PATH}/video`
export const audioDir = `${STORAGE_PATH}/audio`

api.post('/:userId/video', async (req, res, next) => {
  const { url } = req.body
  const { userId } = req.params
  const websocket = req.app.get('websocket')
  console.log('postUrl', { url, userId })
  if (!url) return res.status(400).json({ error: 'url-missing' })
  const video = await download({ url, userId, websocket }).catch(next)
  console.log({ video })
  res.json({ video })
})

api.get('/:userId/videos', async (req, res, next) => {
  const { userId } = req.params
  const videos = await Video.find({ userId }, null, { sort: { createdAt: -1 } })
  res.json({ videos })
})

api.get('/:userId/video/:videoId', async (req, res, next) => {
  const { videoId, userId } = req.params
  const video = await Video.findById(videoId)
  console.log({ videoId, userId, video })
  if (!video.userId === userId) {
    return res.status(403).json({ error: 'video-does-not-belong-to-user' })
  }
  res.sendFile(video.videoPath)
})

api.get('/:userId/audio/:videoId', async (req, res, next) => {
  const { videoId, userId } = req.params
  const video = await Video.findById(videoId)
  console.log({ videoId, userId, video })
  if (!video.userId === userId) {
    return res.status(403).json({ error: 'video-does-not-belong-to-user' })
  }
  res.sendFile(video.audioPath)
})

export default () => {
  fs.promises.mkdir(videoDir, { recursive: true })
  fs.promises.mkdir(audioDir, { recursive: true })
  return api
}
