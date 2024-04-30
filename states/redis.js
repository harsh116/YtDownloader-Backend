const redis = require("redis");

// const redisPassword =
//   process.env.REDIS_PASSWORD || "AxwRZ2N56Ayvkno0o5Z99s8HThwv28GR";
const redisPassword =
  process.env.REDIS_PASSWORD || "5SiFtl4ruyDEJhxEE9Wmjje9qq1iugPj";

const redisPort = process.env.REDIS_PORT || 17860;
const redisHost =
  process.env.REDIS_HOST ||
  "redis-17860.c258.us-east-1-4.ec2.cloud.redislabs.com";

// const redisClient = redis.createClient({
//   password: redisPassword,
//   socket: {
//     host: "redis-17860.c258.us-east-1-4.ec2.cloud.redislabs.com",
//     port: 17860,
//   },
// });

const redisClient = redis.createClient({
  url: `redis://default:${redisPassword}@${redisHost}:${redisPort}`,
});

// "redis-13102.c74.us-east-1-4.ec2.cloud.redislabs.com";

// const redisPort = process.env.REDIS_PORT || 13102;

// const redisClient = redis.createClient({
//   url: `redis://${redisHost}:${redisPort}`,
//   password: redisPassword,
// });

redisClient.on("error", (error) => {
  console.error(`Error: ${error}`);
});

redisClient.connect();

redisClient.on("connect", () => {
  console.log("redis connected");
});

module.exports = { redisClient };
