import { Injectable, Logger } from '@nestjs/common';
import { EmailDto } from './dto/email.dto';

@Injectable()
export class NotificationsService {
  async sendEmail(dto: EmailDto): Promise<string> {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        Logger.log(`${dto.message} Email sent!`);
        resolve(`${dto.message} Email sent!`);
      }, 2000);
    });
  }
}
