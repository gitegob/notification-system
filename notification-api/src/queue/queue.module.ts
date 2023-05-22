import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [QueueService, NotificationsService],
})
export class QueueModule {}
