import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial } from 'typeorm';
import { BaseQueryEntity } from '../../../entities/abstract/BaseQuery';

@Injectable()
export class QueryLogger {
  constructor(private readonly dataSource: DataSource) {}

  async log<E extends BaseQueryEntity>(
    e: new () => E,
    query: DeepPartial<E>,
  ): Promise<E> {
    const repo = this.dataSource.getRepository(e);
    const created = repo.create(query);
    await repo.insert(created as any);
    return created;
  }
}
