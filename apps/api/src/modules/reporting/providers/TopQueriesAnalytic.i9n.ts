import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { TopQueriesAnalyticService } from '../module';
import { DataSource, Repository } from 'typeorm';
import { TimeSeriesQueryEntity } from '../../../entities/TimeSeriesQuery';
import { TopQueriesAnalytic } from './TopQueriesAnalytic';
import { QueryLogger } from './QueryLogger';

describe('TopQueriesAnalyticService)', () => {
  let provider: TopQueriesAnalytic;
  let queryLogger: QueryLogger;
  let repo: Repository<TimeSeriesQueryEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();

    provider = moduleFixture.get(TopQueriesAnalyticService);
    queryLogger = moduleFixture.get(QueryLogger);
    repo = moduleFixture.get(DataSource).getRepository(TimeSeriesQueryEntity);
  });

  beforeEach(async () => {
    await repo.delete({});
  });

  it('getTopQueries - should select only max 10 distinct rows', async () => {
    const startFilter = new Date().toISOString();
    await wait(1000);

    for (let i = 1; i < 12; i += 1) {
      const second = i < 10 ? `0${i}` : `${i}`;
      const ts = `2023-09-05T00:00:${second}.000Z`;

      for (let j = 0; j < i; j += 1) {
        await queryLogger.log(TimeSeriesQueryEntity, {
          type: 'TestTopQueries',
          selectedDateTime: new Date(ts),
        });
      }
    }

    await wait(1000);
    const endFilter = new Date().toISOString();

    const topQueries = await provider.getTopQueries(
      TimeSeriesQueryEntity,
      'selectedDateTime',
      startFilter,
      endFilter,
    );

    expect(topQueries).toStrictEqual([
      {
        selectedDateTime: new Date('2023-09-05T00:00:11.000Z'),
        count: 11,
      },
      {
        selectedDateTime: new Date('2023-09-05T00:00:10.000Z'),
        count: 10,
      },
      {
        selectedDateTime: new Date('2023-09-05T00:00:09.000Z'),
        count: 9,
      },
      {
        selectedDateTime: new Date('2023-09-05T00:00:08.000Z'),
        count: 8,
      },
      {
        selectedDateTime: new Date('2023-09-05T00:00:07.000Z'),
        count: 7,
      },
      {
        selectedDateTime: new Date('2023-09-05T00:00:06.000Z'),
        count: 6,
      },
      {
        selectedDateTime: new Date('2023-09-05T00:00:05.000Z'),
        count: 5,
      },
      {
        selectedDateTime: new Date('2023-09-05T00:00:04.000Z'),
        count: 4,
      },
      {
        selectedDateTime: new Date('2023-09-05T00:00:03.000Z'),
        count: 3,
      },
      {
        selectedDateTime: new Date('2023-09-05T00:00:02.000Z'),
        count: 2,
      },
    ]);
  });
});

async function wait(ms: number): Promise<void> {
  await new Promise((res: (_: void) => void) => {
    setTimeout(() => {
      return res();
    }, ms);
  });
}
