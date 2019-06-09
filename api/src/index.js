import express from 'express'
import bodyParser from 'body-parser'

import redis from './lib/redis.js'
import mongodb from './lib/mongodb.js'
import api from './api/index.js'

const { PORT } = process.env

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('redis', redis)
app.set('mongodb', mongodb)

app.use('/api', api())

app.listen(PORT, () => {
  console.log(`App listenning on ${PORT}`)
})
