import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [NotificationsService],
  exports: [NotificationsService, HttpModule],
})
export class NotificationsModule {}
