import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import Redis from 'ioredis';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { MessageEmitterService } from './_shared/services/message-emitter.service';
import { RedisService } from './_shared/services/redis.service';
import { UsageService } from './_shared/services/usage.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: +process.env.THROTTLE_TTL || 60,
      limit: +process.env.THROTTLE_LIMIT || 100,
      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: 6379,
        }),
      ),
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [RedisService, UsageService, MessageEmitterService],
})
export class AppModule {}
