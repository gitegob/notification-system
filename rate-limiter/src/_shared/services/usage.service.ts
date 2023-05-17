import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Injectable()
export class UsageService {
  private readonly redisClient: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redisClient = this.redisService.getClient();
  }

  async incrementRequestCount(clientId: string) {
    const currentCount = await this.getClientMonthlyRequestCount(clientId);
    Logger.log(`Current count: ${currentCount}`);
    await this.redisClient.incr(`monthly_requests:${clientId}`);
  }

  async getClientMonthlyRequestCount(clientId: string): Promise<number> {
    const count = await this.redisClient.get(`monthly_requests:${clientId}`);
    return count ? parseInt(count, 10) : 0;
  }

  async isClientMonthlyLimitExceeded(clientId: string): Promise<boolean> {
    const limit = this.getClientMonthlyLimit(clientId);
    const count = await this.getClientMonthlyRequestCount(clientId);
    return count > limit;
  }

  @Cron('* * * */30 * *')
  async resetMonthlyCounters() {
    const keys = await this.redisClient.keys('monthly_requests:*');
    if (keys.length > 0) {
      await this.redisClient.del(...keys);
    }
  }
  @Cron('*/1 * * * * *')
  async resetPerSecondCounters() {
    const keys = await this.redisClient.keys('second_requests:*');
    if (keys.length > 0) {
      await this.redisClient.del(...keys);
    }
  }

  getClientMonthlyLimit(clientId: string) {
    // TODO Get client monthly limit from database for the current month
    return 1000;
  }
  getClientLimitPerSecond(clientId: string): number {
    // TODO get client limit per second from database
    return 1;
  }
}
