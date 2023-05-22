import { Injectable } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { ThrottlerStorageOptions } from '@nestjs/throttler/dist/throttler-storage-options.interface';
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';
import { UsageService } from './usage.service';

@Injectable()
export class ThrottlerStorageService implements ThrottlerStorage {
  constructor(private readonly usageService: UsageService) {}
  storage: Record<string, ThrottlerStorageOptions>;
  async increment(key: string, ttl: number): Promise<ThrottlerStorageRecord> {
    return { totalHits: 0, timeToExpire: 0 };
  }
  async getRecord(key: string): Promise<number> {
    const rateLimit = this.usageService.getClientLimitPerTimeWindow(key);
    return rateLimit || 0;
  }

  async getRateLimit(key: string): Promise<number> {
    return this.getRecord(key);
  }
}
