import { BaseEntity } from './Base';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GeoLocationQueryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  queryId!: string;

  @Column({ type: 'text', update: false, nullable: false })
  location!: string;

  @Column({ type: 'decimal' })
  latitude!: number;

  @Column({ type: 'decimal' })
  longitude!: number;

  @Column({ type: 'text' })
  type!: string;

  @Column({ type: 'jsonb' })
  metadata!: Record<string, any>;
}
