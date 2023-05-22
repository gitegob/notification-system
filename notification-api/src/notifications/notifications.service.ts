import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { EmailDto } from './dto/email.dto';
import 'dotenv/config';

@Injectable()
export class NotificationsService {
  constructor(private readonly http: HttpService) {}
  async sendSMS(dto: EmailDto): Promise<void> {
    const data = {
      to: dto.to,
      text: dto.message,
      sender: 'XYZ',
    };
    await lastValueFrom(
      this.http
        .post(process.env.PINDO_URL, data, {
          headers: {
            Authorization: `Bearer ${process.env.PINDO_API_KEY}`,
          },
        })
        .pipe(
          map((response) => {
            return response.data;
          }),
        ),
    );
  }
}
