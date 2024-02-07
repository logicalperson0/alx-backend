import redis from 'redis';

const Newclient = redis.createClient();

// when npm run dev 0-redis_client.js USE: 
// redis-7.2.4/src/redis-server > /dev/null 2>&1 & because
// the src is in the redis-7.2.4 folder!
Newclient
  .on('error', err => console.log(`Redis client not connected to the server: ${err}`))
  .on('ready', () => console.log(`Redis client connected to the server`));

const hash = 'HolbertonSchools';

const fields = {
  'Portland': 50,
  'Seattle': 80,
  'New York': 20,
  'Bogota': 20,
  'Cali': 40,
  'Paris': 2
};

for (const [k, v] of Object.entries(fields)) {
  Newclient.hset(hash, k, v, redis.print);
};

Newclient.hgetall(hash, (err, reply) => {
  console.log(reply);
});
