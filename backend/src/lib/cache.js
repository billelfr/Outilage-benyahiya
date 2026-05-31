const { createClient } = require("redis");

const DEFAULT_REDIS_URL = "redis://localhost:6379";
const DEFAULT_CACHE_TTL_SECONDS = 60;

let client;
let connectPromise;
let cacheAvailable = false;

function isCacheEnabled() {
  return process.env.REDIS_ENABLED !== "false";
}

function getCacheTtlSeconds() {
  const ttl = Number(process.env.REDIS_TTL_SECONDS);
  return Number.isFinite(ttl) && ttl > 0 ? ttl : DEFAULT_CACHE_TTL_SECONDS;
}

async function getClient() {
  if (!isCacheEnabled()) {
    return null;
  }

  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL || DEFAULT_REDIS_URL,
    });

    client.on("error", (error) => {
      cacheAvailable = false;
      console.warn("Redis cache error:", error.message);
    });

    client.on("ready", () => {
      cacheAvailable = true;
      console.log("Redis cache connected");
    });

    client.on("end", () => {
      cacheAvailable = false;
    });
  }

  if (!client.isOpen) {
    connectPromise ||= client.connect().finally(() => {
      connectPromise = null;
    });

    try {
      await connectPromise;
    } catch {
      return null;
    }
  }

  return cacheAvailable ? client : null;
}

async function getJson(key) {
  try {
    const redisClient = await getClient();

    if (!redisClient) {
      return null;
    }

    const cachedValue = await redisClient.get(key);
    return cachedValue ? JSON.parse(cachedValue) : null;
  } catch (error) {
    console.warn("Redis cache read skipped:", error.message);
    return null;
  }
}

async function setJson(key, value, ttlSeconds = getCacheTtlSeconds()) {
  try {
    const redisClient = await getClient();

    if (!redisClient) {
      return;
    }

    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch (error) {
    console.warn("Redis cache write skipped:", error.message);
  }
}

async function deleteByPattern(pattern) {
  try {
    const redisClient = await getClient();

    if (!redisClient) {
      return;
    }

    for await (const key of redisClient.scanIterator({ MATCH: pattern, COUNT: 100 })) {
      await redisClient.del(key);
    }
  } catch (error) {
    console.warn("Redis cache invalidation skipped:", error.message);
  }
}

async function disconnectCache() {
  if (client?.isOpen) {
    await client.quit();
  }
}

module.exports = {
  deleteByPattern,
  disconnectCache,
  getJson,
  setJson,
};
