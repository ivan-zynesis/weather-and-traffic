import { Column, Entity, Index } from 'typeorm';
import { BaseQueryEntity } from './BaseQuery';

@Index('IDX_TimeSeriesQuery-type/selectedDateTime', [
  'type',
  'selectedDateTime',
])
@Entity()
export class TimeSeriesQueryEntity extends BaseQueryEntity {
  @Column({ type: 'timestamptz', update: false, nullable: false })
  selectedDateTime!: Date;

  @Column({ type: 'text' })
  type!: string;
}
