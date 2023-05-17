import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class MessageEmitterService {
  private channel: amqp.Channel;
  private queue = 'notification_requests';

  constructor() {
    this.initialize();
  }

  private async initialize() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(this.queue, {
      durable: true,
    });
  }

  async enqueueMessage(message: any) {
    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }
}
