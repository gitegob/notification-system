import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Redis } from 'ioredis';
import * as request from 'supertest';
import { MessageEmitterService } from '../src/_shared/services/message-emitter.service';
import { RedisService } from '../src/_shared/services/redis.service';
import { UsageService } from '../src/_shared/services/usage.service';
import { AppModule } from './../src/app.module';
import 'dotenv/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let redisService: RedisService;
  let redisClient: Redis;
  let usageService: UsageService;
  let messageEmitterService: MessageEmitterService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    redisService = moduleFixture.get<RedisService>(RedisService);
    usageService = moduleFixture.get<UsageService>(UsageService);
    messageEmitterService = moduleFixture.get<MessageEmitterService>(
      MessageEmitterService,
    );
    jest
      .spyOn(messageEmitterService, 'enqueueMessage')
      .mockImplementation(async () => Promise.resolve());
    redisClient = redisService.getClient();
    await redisClient.flushall();
    await app.init();
  });

  afterAll(async () => {
    await redisClient.flushall();
    await redisClient.quit();
    await app.close();
  });
  it('should limit requests within the same time window from a client', async () => {
    jest
      .spyOn(usageService, 'getClientLimitPerTimeWindow')
      .mockImplementation(() => 2);
    jest.spyOn(usageService, 'getClientTimeWindow').mockImplementation(() => 3);
    for (const [i, el] of Array(5).entries()) {
      if (i === 4) {
        return await request(app.getHttpServer())
          .post('/notifications')
          .set('client-id', '1')
          .send({
            to: '+250788787878',
            message: 'Hello Wodfrld!',
          })
          .expect(HttpStatus.TOO_MANY_REQUESTS);
      } else
        await request(app.getHttpServer())
          .post('/notifications')
          .set('client-id', '1')
          .send({
            to: '+250788787878',
            message: 'Hello Worlded!',
          });
    }
  });

  it('should limit requests from a specific client on a per month basis', async () => {
    jest
      .spyOn(usageService, 'getClientMonthlyLimit')
      .mockImplementation(() => 60);

    for (const [i, el] of Array(70).entries()) {
      if (i === 70) {
        return await request(app.getHttpServer())
          .post('/notifications')
          .set('client-id', '2')
          .send({
            to: '+250788787878',
            message: 'Hello World!',
          })
          .expect(HttpStatus.TOO_MANY_REQUESTS);
      } else
        await request(app.getHttpServer())
          .post('/notifications')
          .set('client-id', '2')
          .send({
            to: '+250788787878',
            message: 'Hello World!',
          });
    }
  });

  it('should limit requests across the entire system', async () => {
    const totalRequests = +process.env.THROTTLE_LIMIT + 1;
    console.log(100);

    for (const [i, el] of Array(totalRequests).entries()) {
      if (i === totalRequests - 1) {
        return await request(app.getHttpServer())
          .post('/notifications')
          .set('client-id', randomUUID())
          .send({
            to: '+250788787878',
            message: 'Hello World!',
          })
          .expect(HttpStatus.TOO_MANY_REQUESTS);
      } else
        await request(app.getHttpServer())
          .post('/notifications')
          .set('client-id', randomUUID())
          .send({
            to: '+250788787878',
            message: 'Hello World!',
          });
    }
  });
});
