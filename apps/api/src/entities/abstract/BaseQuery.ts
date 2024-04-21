import { BaseEntity } from './Base';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export abstract class BaseQueryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  queryId!: string;
}
