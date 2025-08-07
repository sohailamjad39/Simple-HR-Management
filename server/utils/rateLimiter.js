// server/utils/rateLimiter.js
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.error('Redis Client Error', err));

await client.connect();

/**
 * Check if request is rate limited
 * @param {string} key - Unique identifier (e.g., ip:forgot-password)
 * @param {number} maxAttempts - Max attempts allowed
 * @param {number} windowMs - Time window in ms
 * @returns {Promise<{ success: boolean, message: string, resetIn: number }>}
 */
export const rateLimit = async (key, maxAttempts = 3, windowMs = 24 * 60 * 60 * 1000) => {
  const current = await client.get(key);
  
  if (current === null) {
    // First attempt
    await client.setex(key, Math.ceil(windowMs / 1000), '1');
    return { success: true };
  }

  const count = parseInt(current, 10);

  if (count >= maxAttempts) {
    const ttl = await client.ttl(key);
    const resetIn = ttl * 1000; // ms

    return {
      success: false,
      message: `Too many requests. Please try again after ${Math.ceil(resetIn / 60000)} minutes.`,
      resetIn
    };
  }

  // Increment counter
  await client.incr(key);

  return { success: true };
};

export default client;