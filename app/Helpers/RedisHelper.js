'use strict'

const Redis = use('Redis')
const redisDeletePattern = require('redis-delete-pattern')

class RedisHelper {

  async get(key) {
    const data = await Redis.get(key)
    return JSON.parse(data)
  }

  async set(key, data) {
    await Redis.set(key, JSON.stringify(data))
  }

  async clear() {
    await Redis.flushall()
  }

  delete(pattern) {
    return new Promise(
      (resolve, reject) => {
        redisDeletePattern({
          redis: Redis,
          pattern: pattern
        }, function handleError(err) {
          if (err) reject(err)
          resolve('Success')
        })
      }
    )
  }

}

module.exports = new RedisHelper()
