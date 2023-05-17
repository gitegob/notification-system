import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { MessageEmitterService } from '../_shared/services/message-emitter.service';
import { EmailDto } from './dto/email.dto';

@Controller('notifications')
@UseGuards(ThrottlerGuard)
export class NotificationsController {
  constructor(private readonly messageEmitterService: MessageEmitterService) {}
  @Post()
  async sendEmail(@Body() dto: EmailDto): Promise<string> {
    await this.messageEmitterService.enqueueMessage(dto);
    return 'Message sent to queue';
  }
}
