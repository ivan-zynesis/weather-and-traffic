import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { TimeSeriesQueryAnalyticService } from '../module';
import { TimeSeriesQueryAnalytic } from './TimeSeriesQueryAnalytic';
import { DataSource, Repository } from 'typeorm';
import { TimeSeriesQueryEntity } from '../../../entities/TimeSeriesQuery';

// FIXME: at the moment all e2e requires postgres manual spin up
describe('TimeSeriesQueryAnalyticService)', () => {
  let provider: TimeSeriesQueryAnalytic;
  let repo: Repository<TimeSeriesQueryEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();

    provider = moduleFixture.get(TimeSeriesQueryAnalyticService);
    repo = moduleFixture.get(DataSource).getRepository(TimeSeriesQueryEntity);
  });

  beforeEach(async () => {
    await repo.delete({});
  });

  it('log', async () => {
    const isoString = '2024-01-23T12:34:56.789Z';
    await provider.log({
      type: 'TestLog',
      selectedDateTime: new Date(isoString),
    });

    const all = await repo.find({
      where: {
        type: 'TestLog',
      },
    });
    expect(
      all.some(
        (row) =>
          row.type === 'TestLog' &&
          row.selectedDateTime.toISOString() === isoString,
      ),
    ).toStrictEqual(true);
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
        await provider.log({
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
