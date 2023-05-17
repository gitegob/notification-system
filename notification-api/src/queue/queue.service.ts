import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class QueueService {
  private channel: amqp.Channel;
  private queue = 'notification_requests';

  constructor(private readonly notificationService: NotificationsService) {
    this.initialize();
  }

  private async initialize() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(this.queue, {
      durable: true,
    });
    this.channel.prefetch(1);
    this.consumeRequests();
  }

  private async consumeRequests() {
    this.channel.consume(this.queue, async (msg) => {
      if (msg) {
        const json = JSON.parse(msg.content.toString());
        this.notificationService.sendEmail({ message: json.message });
        this.channel.ack(msg);
      }
    });
  }

  async enqueueMessage(message: any) {
    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }
}
