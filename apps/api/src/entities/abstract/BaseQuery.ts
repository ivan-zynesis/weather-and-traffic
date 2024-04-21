import { BaseEntity } from './Base';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type SupportedQueryType = 'traffic-cam' | 'weather-forecast' | string;

@Entity()
export abstract class BaseQueryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  queryId!: string;

  @Column({ type: 'text' })
  type!: SupportedQueryType;
}
