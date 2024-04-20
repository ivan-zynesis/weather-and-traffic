import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseQueryEntity } from '../../../entities/BaseQuery';

@Injectable()
export class RecentQueriesAnalytic {
  constructor(private readonly dataSource: DataSource) {}

  async getRecentQueries<E extends BaseQueryEntity, Key extends keyof E>(
    e: new () => E,
    field: Key,
  ): Promise<Array<Pick<E, Key | 'createdAt'>>> {
    const repo = this.dataSource.getRepository(e);
    const raw = await repo
      .createQueryBuilder('a')
      .select(`distinct("${field as string}")`)
      .addSelect('max("a"."createdAt")', 'createdAt')
      .groupBy(`"${field as string}"`)
      .orderBy(`"createdAt"`, 'DESC')
      .limit(10)
      .printSql()
      .getRawMany();

    return raw;
  }
}
