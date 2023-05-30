import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { EurekaModule } from 'nestjs-eureka';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './notifications/notifications.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    NotificationsModule,
    QueueModule,
    HttpModule,
    EurekaModule.forRoot({
      eureka: {
        host: process.env.EUREKA_HOST || 'localhost',
        port: process.env.EUREKA_PORT || 8761,
        registryFetchInterval: 1000,
        maxRetries: 3,
      },
      service: {
        name: 'notification-api',
        port: 4000,
        host: process.env.HOST || 'localhost',
      },
      clientLogger: {
        debug: () => {
          return null;
        },
        warn: (...args) => {
          Logger.warn(args);
        },
        error: (...args) => {
          Logger.error(args);
        },
        info: () => {
          return null;
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
