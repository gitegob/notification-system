import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { MessageEmitterService } from '../_shared/services/message-emitter.service';

@Module({
  controllers: [NotificationsController],
  providers: [MessageEmitterService],
})
export class NotificationsModule {}
