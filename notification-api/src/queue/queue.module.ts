import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  providers: [QueueService, NotificationsService],
})
export class QueueModule {}
