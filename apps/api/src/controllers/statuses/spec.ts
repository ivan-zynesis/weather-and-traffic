import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './controller';
import { DataSource } from 'typeorm';

describe('StatusesController', () => {
  let app: TestingModule;
  let controller: StatusController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [
        {
          provide: DataSource,
          useValue: {
            isInitialized: true,
          } as DataSource,
        },
      ],
    }).compile();

    controller = app.get(StatusController);
  });

  afterAll(() => app.close());

  describe('statuses', () => {
    it('should return healthiness of services', async () => {
      expect(await controller.status()).toStrictEqual({
        main: 'OK',
        db: 'OK',
      });
    });
  });
});
