import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000, () => {
    Logger.log(`Server running on http://localhost:4000`, 'Bootstrap');
  });
}
bootstrap();
