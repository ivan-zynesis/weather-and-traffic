import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './controller';

describe('StatusesController', () => {
  let controller: StatusController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [],
    }).compile();

    controller = app.get(StatusController);
  });

  describe('statuses', () => {
    it('should return "Hello World!"', () => {
      expect(controller.status()).toStrictEqual({
        main: 'OK',
      });
    });
  });
});
