import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import redis from './lib/redis.js'
import mongodb from './lib/mongodb.js'
import api from './api/index.js'
import io from './utils/websocket.js'

const { PORT } = process.env

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(morgan('dev'))

app.set('redis', redis)
app.set('mongodb', mongodb)

app.user('/static', express.static('../static'))
app.use('/api', api())

const server = app.listen(PORT, () => {
  console.log(`App listenning on ${PORT}`)
})

const websocket = io(server)
app.set('websocket', websocket)
