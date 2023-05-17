import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsageService } from '../services/usage.service';

@Injectable()
export class RequestLimitMiddleware implements NestMiddleware {
  constructor(private readonly usageService: UsageService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const clientId = req.headers['client-id'].toString();
    await this.usageService.incrementRequestCount(clientId);
    const isClientMonthlyLimitExceeded =
      await this.usageService.isClientMonthlyLimitExceeded(clientId);
    if (isClientMonthlyLimitExceeded) {
      return res.status(429).json({ message: 'Monthly request limit reached' });
    }
    next();
  }
}
