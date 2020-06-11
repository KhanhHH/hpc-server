import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  BaseEntity,
  Unique
} from 'typeorm';
import { FeatureStatus } from '../features/feature.enum';
import { Account } from '../accounts/account.entity';
import { ComputingUserType } from './computing.enum';

@Entity()
@Unique(['id'])
export class Computing extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ComputingUserType
  })
  userType: string;

  @Column()
  maxCpu: number;

  @Column({ type: 'bigint' })
  maxRam: number;

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
