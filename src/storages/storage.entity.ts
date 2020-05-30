import {
  Unique,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { Account } from '../accounts/account.entity';
import { FeatureStatus } from '../features/feature.enum';

@Entity()
@Unique(['id'])
export class Storage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 0
  })
  currentSize: number;

  @Column()
  maxSize: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({
    type: 'enum',
    enum: FeatureStatus,
    default: FeatureStatus.DEACTIVE
  })
  status: string;

  @OneToOne(
    () => Account,
    account => account.id,
    { eager: true }
  )
  @JoinColumn()
  account: Account;
}
