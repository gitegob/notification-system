import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { EmailDto } from './_shared/dto/email.dto';
import { RateLimitGuard } from './_shared/guards/rate-limit.guard';
import { MessageEmitterService } from './_shared/services/message-emitter.service';

@Controller()
@ApiSecurity('client-id')
export class AppController {
  constructor(private readonly messageEmitterService: MessageEmitterService) {}
  @Post('notifications')
  @UseGuards(ThrottlerGuard, RateLimitGuard)
  async sendEmail(@Body() dto: EmailDto): Promise<string> {
    console.log(dto.to);
    await this.messageEmitterService.enqueueMessage(dto);
    return 'Message sent to queue';
  }
}
