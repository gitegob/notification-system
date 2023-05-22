import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { RedisService } from '../services/redis.service';
import { UsageService } from '../services/usage.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly redisClient = this.redisService.getClient();
  constructor(
    private readonly usageService: UsageService,
    private readonly redisService: RedisService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const clientId = req.headers['client-id']?.toString();
    if (clientId) {
      const isClientMonthlyLimitExceeded =
        await this.usageService.isClientMonthlyLimitExceeded(clientId);
      if (isClientMonthlyLimitExceeded) {
        throw new HttpException('Monthly request limit reached', 429);
      }
      await this.usageService.incrementMonthlyRequestCount(clientId);
      const timeWindowInSeconds =
        this.usageService.getClientTimeWindow(clientId); // Adjust the time window as per your requirements
      const maxRequestsPerWindow =
        this.usageService.getClientLimitPerTimeWindow(clientId);
      const currentTime = Date.now();
      const key = `rate-limiter:${clientId}`;

      await this.redisClient.zremrangebyscore(
        key,
        '-inf',
        currentTime - timeWindowInSeconds * 1000,
      );

      const currentRequestCount = await this.redisClient.zcard(key);

      if (currentRequestCount >= maxRequestsPerWindow)
        throw new HttpException('Too many requests for this client', 429);

      await this.redisClient.zadd(key, currentTime, currentTime.toString());

      await this.redisClient.expire(key, timeWindowInSeconds);
    }
    return true;
  }
}
