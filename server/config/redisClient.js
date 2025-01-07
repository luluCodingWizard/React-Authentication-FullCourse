import redis from "redis";

// Initialize Redis client
const redisClient = redis.createClient();
redisClient.on("connect", () => {
  console.log("Connected to Redis!");
});

// Function to blacklist a token
const blacklistToken = (token, expiresIn) => {
  redisClient.set(token, "blacklisted", "EX", expiresIn, (err) => {
    if (err) console.error("Failed to blacklist token:", err);
  });
};

export { blacklistToken };
