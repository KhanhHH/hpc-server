import {
  Unique,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { Account } from '../accounts/account.entity';
import { FeatureRequestStatus } from './feature-request-status.enum';
import { FeatureCode } from './feature.enum';
import { ComputingUserType } from '../computings/computing.enum';

@Entity()
@Unique(['id'])
export class FeatureRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Storage
  @Column({ type: 'bigint', nullable: true })
  maxSize: number;

  //Computing
  @Column({ type: 'enum', enum: ComputingUserType, nullable: true })
  userType: string;

  @Column({ nullable: true })
  maxCpu: number;

  @Column({ type: 'bigint', nullable: true })
  maxRam: number;

  //Virtual Machine
  @Column({ nullable: true })
  vmCpu: number;

  @Column({ type: 'bigint', nullable: true })
  vmRam: number;

  @Column({ type: 'bigint', nullable: true })
  vmHdd: number;

  ///////////////////////

  @Column()
  endDate: Date;

  @Column({
    type: 'enum',
    enum: FeatureCode
  })
  featureCode: string;

  @Column({
    type: 'enum',
    enum: FeatureRequestStatus,
    default: FeatureRequestStatus.PENDING
  })
  status: string;

  @ManyToOne(
    () => Account,
    account => account.id,
    { eager: true }
  )
  @JoinColumn()
  account: Account;
}
