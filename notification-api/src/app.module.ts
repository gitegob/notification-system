import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './notifications/notifications.module';
import { QueueModule } from './queue/queue.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [NotificationsModule, QueueModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
