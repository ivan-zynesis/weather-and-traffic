import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseQueryEntity } from '../../../entities/BaseQuery';

@Injectable()
export class TopQueriesAnalytic {
  constructor(private readonly dataSource: DataSource) {}

  async getTopQueries<E extends BaseQueryEntity, Key extends keyof E>(
    e: new () => E,
    field: Key,
    start: string,
    end: string,
  ): Promise<Array<Pick<E, Key> & { count: number }>> {
    const repo = this.dataSource.getRepository(e);
    const raw = await repo
      .createQueryBuilder('a')
      .select(`"${field as string}"`)
      .addSelect(`count("a"."${field as string}")`, 'count')
      .where(`"a"."createdAt" >= '${start}'`)
      .andWhere(`"a"."createdAt" < '${end}'`)
      .groupBy(`"${field as string}"`)
      .orderBy(`"count"`, 'DESC')
      .limit(10)
      .printSql()
      .getRawMany();

    return raw.map((i) => ({
      ...i,
      count: parseInt(i.count),
    }));
  }
}
