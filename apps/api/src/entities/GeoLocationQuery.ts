import { Column, Entity } from 'typeorm';
import { BaseQueryEntity } from './abstract/BaseQuery';

@Entity()
export class GeoLocationQueryEntity extends BaseQueryEntity {
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
