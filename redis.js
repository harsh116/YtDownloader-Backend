const redis = require("redis");

const redisHost =
  process.env.REDIS_HOST ||
  "redis-17860.c258.us-east-1-4.ec2.cloud.redislabs.com";

const redisPort = process.env.REDIS_PORT || 17860;
const redisPassword =
  process.env.REDIS_PASSWORD || "5SiFtl4ruyDEJhxEE9Wmjje9qq1iugPj";

const redisClient = redis.createClient({
  url: `redis://${redisHost}:${redisPort}`,
  password: redisPassword,
});

redisClient.on("error", (error) => {
  console.error(`Error: ${error}`);
});

redisClient.connect();

redisClient.on("connect", () => {
  console.log("redis connected");
});

module.exports = { redisClient };
