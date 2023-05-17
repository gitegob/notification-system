import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;
  constructor() {
    this.redisClient = new Redis({
      // TODO get host and port from config
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379,
    });
  }

  getClient(): Redis {
    return this.redisClient;
  }
}
