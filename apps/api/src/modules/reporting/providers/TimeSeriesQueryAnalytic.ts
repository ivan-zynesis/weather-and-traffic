import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TimeSeriesQueryEntity } from '../../../entities/TimeSeriesQuery';

type NewQuery = Pick<TimeSeriesQueryEntity, 'type' | 'selectedDateTime'>;

@Injectable()
export class TimeSeriesQueryAnalytic {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(TimeSeriesQueryEntity)
    private readonly repo: Repository<TimeSeriesQueryEntity>,
  ) {}

  async log(query: NewQuery): Promise<TimeSeriesQueryEntity> {
    const created = this.repo.create(query);
    await this.repo.insert(created);
    return created;
  }

  async selectMostQueried(
    type: string,
    start: string,
    end: string,
  ): Promise<string> {
    const raw = await this.repo
      .createQueryBuilder('a')
      .select(`date_trunc('minute',"a"."selectedDateTime")::text`, 'blockTime')
      .addSelect(`count("queryId")`, 'count')
      .where(`"a"."type" = '${type}'`)
      .andWhere(`"a"."selectedDateTime" >= '${start}'`)
      .andWhere(`"a"."selectedDateTime" < '${end}'`)
      .groupBy(`date_trunc('minute',"a"."selectedDateTime")`)
      .orderBy(`date_trunc('minute',"a"."selectedDateTime")`)
      .printSql()
      .getRawMany();

    if (raw.length === 0) {
      return 'No query found';
    }

    const minuteGroupCount = raw.map((d) => ({
      ...d,
      blockTime: new Date(d.blockTime).toISOString(),
      count: parseInt(d.count),
    }));

    // console.log('========== minuteGroupCount ===========')
    // console.log(minuteGroupCount)

    const fullSeries = leftJoin(
      generateTimeSeries(new Date(start), new Date(end), 'minute'),
      minuteGroupCount,
    );

    const rollingSumSeries = rollingWindowSum(fullSeries, 60);
    const sortedDesc = rollingSumSeries.sort((a, b) => b.sum - a.sum);

    return sortedDesc[0].blockTime;
  }
}

function rollingWindowSum<
  D extends { blockTime: string; data: null | { count: number } },
>(series: D[], windowSize: number): { blockTime: string; sum: number }[] {
  const result: { blockTime: string; sum: number }[] = [];
  for (let i = 0; i < series.length - windowSize; i += 1) {
    const summed = {
      blockTime: series[i].blockTime,
      sum: 0,
    };

    // skip if no request sent in this MINUTE block
    if (series[i].data) {
      summed.sum = series
        .slice(i, i + windowSize)
        .reduce((accu, curr) => accu + (curr.data?.count ?? 0), 0);
    }

    result.push(summed);
  }
  return result;
}

function leftJoin<D extends { blockTime: string; count: number }>(
  timeSeries: string[],
  data: D[],
): Array<{ blockTime: string; data: D | null }> {
  return timeSeries.map((blockTime) => {
    const joined = data.find((d) => d.blockTime === blockTime) ?? null;
    return {
      blockTime,
      data: joined,
    };
  });
}

function generateTimeSeries(
  start: Date,
  end: Date,
  mode: 'minute' | 'hour',
): string[] {
  let zero = trunc(start, mode).getTime();
  const nMinusOne = trunc(end, mode).getTime();

  let block = 60 * 1000;
  if (mode === 'hour') block *= 60;

  const series = [];
  do {
    series.push(timestampToIsoString(zero));
    zero += block;
  } while (zero < nMinusOne);

  return series;
}

function trunc(date: Date, mode: 'minute' | 'hour'): Date {
  const truncated = new Date(date);
  if (mode === 'minute') truncated.setSeconds(0, 0);
  else truncated.setHours(0, 0, 0, 0);
  return truncated;
}

function timestampToIsoString(ts: number): string {
  return new Date(ts).toISOString();
}
