import { Column, Entity } from 'typeorm';
import { BaseQueryEntity } from './abstract/BaseQuery';

@Entity()
export class GeoLocationQueryEntity extends BaseQueryEntity {
  @Column({ type: 'text', update: false, nullable: true })
  location!: string | null;

  @Column({ type: 'text' })
  latLng!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any> | null;
}
