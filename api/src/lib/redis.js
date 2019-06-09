import redis from 'redis'
import bluebird from 'bluebird'

export const MAIN_KEY = 'email.task'

bluebird.promisifyAll(redis)

const ONE_DAY = 60 * 60 * 24
const redisClient = redis.createClient()

const client = {
  set: (key, value, expire = ONE_DAY) => redisClient.setAsync(`${MAIN_KEY}_${key}`, value, 'EX', expire),
  get: key => redisClient.getAsync(`${MAIN_KEY}_${key}`),
  del: key => redisClient.delAsync(`${MAIN_KEY}_${key}`),
  find: pattern => redisClient.keysAsync(pattern),
  expire: (key, expire = ONE_DAY) => redisClient.expireAsync(`(${MAIN_KEY}_${key}`, expire),
}

export default client
