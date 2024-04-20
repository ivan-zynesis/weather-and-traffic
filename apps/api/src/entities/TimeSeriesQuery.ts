import { BaseEntity } from './Base';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('IDX_TimeSeriesQuery-type/selectedDateTime', [
  'type',
  'selectedDateTime',
])
@Entity()
export class TimeSeriesQueryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  queryId!: string;

  @Column({ type: 'timestamptz', update: false, nullable: false })
  selectedDateTime!: Date;

  @Column({ type: 'text' })
  type!: string;
}
