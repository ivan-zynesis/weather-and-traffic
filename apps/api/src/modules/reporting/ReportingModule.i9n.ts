import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import {
  RecentQueriesAnalyticService,
  TimeSeriesQueryAnalyticService,
  TopQueriesAnalyticService,
} from './module';
import { DataSource, Repository } from 'typeorm';
import { TimeSeriesQueryEntity } from '../../entities/TimeSeriesQuery';
import { RecentQueriesAnalytic } from './providers/RecentQueriesAnalytic';
import { QueryLogger } from './providers/QueryLogger';
import { TimeSeriesQueryAnalytic } from './providers/TimeSeriesQueryAnalytic';
import { TopQueriesAnalytic } from './providers/TopQueriesAnalytic';

describe('Analytic Service', () => {
  let moduleFixture: TestingModule;
  let queryLogger: QueryLogger;
  let repo: Repository<TimeSeriesQueryEntity>;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();

    queryLogger = moduleFixture.get(QueryLogger);
    repo = moduleFixture.get(DataSource).getRepository(TimeSeriesQueryEntity);
  });

  beforeEach(async () => {
    await repo.delete({});
  });

  describe('RecentQueriesAnalyticService', () => {
    let provider: RecentQueriesAnalytic;

    beforeAll(() => {
      provider = moduleFixture.get(RecentQueriesAnalyticService);
    });

    it('getRecentQueries - should select only max 10 distinct rows', async () => {
      for (let i = 1; i < 12; i += 1) {
        const second = i < 10 ? `0${i}` : `${i}`;
        const ts = `2023-09-05T00:00:${second}.000Z`;

        // insert twice, only distinct row
        await queryLogger.log(TimeSeriesQueryEntity, {
          type: 'TestSumOverMovingWindow',
          selectedDateTime: new Date(ts),
        });
        await queryLogger.log(TimeSeriesQueryEntity, {
          type: 'TestSumOverMovingWindow',
          selectedDateTime: new Date(ts),
        });
      }

      const recentQueries = await provider.getRecentQueries(
        TimeSeriesQueryEntity,
        'selectedDateTime',
      );

      expect(recentQueries).toStrictEqual([
        {
          selectedDateTime: new Date('2023-09-05T00:00:11.000Z'),
          createdAt: expect.any(Date),
        },
        {
          selectedDateTime: new Date('2023-09-05T00:00:10.000Z'),
          createdAt: expect.any(Date),
        },
        {
          selectedDateTime: new Date('2023-09-05T00:00:09.000Z'),
          createdAt: expect.any(Date),
        },
        {
          selectedDateTime: new Date('2023-09-05T00:00:08.000Z'),
          createdAt: expect.any(Date),
        },
        {
          selectedDateTime: new Date('2023-09-05T00:00:07.000Z'),
          createdAt: expect.any(Date),
        },
        {
          selectedDateTime: new Date('2023-09-05T00:00:06.000Z'),
          createdAt: expect.any(Date),
        },
        {
          selectedDateTime: new Date('2023-09-05T00:00:05.000Z'),
          createdAt: expect.any(Date),
        },
        {
          selectedDateTime: new Date('2023-09-05T00:00:04.000Z'),
          createdAt: expect.any(Date),
        },
        {
          selectedDateTime: new Date('2023-09-05T00:00:03.000Z'),
          createdAt: expect.any(Date),
        },
        {
          selectedDateTime: new Date('2023-09-05T00:00:02.000Z'),
          createdAt: expect.any(Date),
        },
      ]);
    });
  });

  describe('TimeSeriesQueryAnalyticService', () => {
    let provider: TimeSeriesQueryAnalytic;

    beforeAll(() => {
      provider = moduleFixture.get(TimeSeriesQueryAnalyticService);
    });

    it('selectMostQueried', async () => {
      const fixture = [
        '2023-09-05T00:00:01.001Z',
        '2023-09-05T00:15:02.002Z',
        '2023-09-05T00:30:03.003Z',
        '2023-09-05T02:45:04.004Z',
        '2023-09-05T03:30:05.005Z',
        '2023-09-05T03:35:06.006Z',
        '2023-09-05T03:40:07.007Z',
      ];

      await Promise.all(
        fixture.map(async (dateIsoString) => {
          await queryLogger.log(TimeSeriesQueryEntity, {
            type: 'TestSumOverMovingWindow',
            selectedDateTime: new Date(dateIsoString),
          });
        }),
      );

      const mostQueriedParam = await provider.selectMostQueried(
        'TestSumOverMovingWindow',
        '2023-09-05T00:00:00.000Z',
        '2023-09-06T00:00:00.000Z',
      );
      expect(mostQueriedParam).toStrictEqual('2023-09-05T02:45:00.000Z');
    });
  });

  describe('TopQueriesAnalyticService)', () => {
    let provider: TopQueriesAnalytic;

    beforeAll(() => {
      provider = moduleFixture.get(TopQueriesAnalyticService);
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
});

async function wait(ms: number): Promise<void> {
  await new Promise((res: (_: void) => void) => {
    setTimeout(() => {
      return res();
    }, ms);
  });
}
