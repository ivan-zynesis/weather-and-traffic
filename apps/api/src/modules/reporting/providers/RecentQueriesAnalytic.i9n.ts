import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { RecentQueriesAnalyticService } from '../module';
import { DataSource, Repository } from 'typeorm';
import { TimeSeriesQueryEntity } from '../../../entities/TimeSeriesQuery';
import { RecentQueriesAnalytic } from './RecentQueriesAnalytic';
import { QueryLogger } from './QueryLogger';

describe('RecentQueriesAnalyticService)', () => {
  let provider: RecentQueriesAnalytic;
  let queryLogger: QueryLogger;
  let repo: Repository<TimeSeriesQueryEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();

    provider = moduleFixture.get(RecentQueriesAnalyticService);
    queryLogger = moduleFixture.get(QueryLogger);
    repo = moduleFixture.get(DataSource).getRepository(TimeSeriesQueryEntity);
  });

  beforeEach(async () => {
    await repo.delete({});
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
