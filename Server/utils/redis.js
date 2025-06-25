const Redis = require('ioredis');
require('dotenv').config();

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASS,
    port: process.env.REDIS_PORT
})

redisClient.on('connect' , () => {
    console.log('Redis Connected')
})

module.exports = redisClient