import redis from 'redis';

const Newclient = redis.createClient();

// when npm run dev 0-redis_client.js USE: 
// redis-7.2.4/src/redis-server > /dev/null 2>&1 & because
// the src is in the redis-7.2.4 folder!
Newclient
  .on('error', err => console.log(`Redis client not connected to the server: ${err}`))
  .on('ready', () => console.log(`Redis client connected to the server`));
