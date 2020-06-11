import { Entity, PrimaryGeneratedColumn, Column, OneToOne, BaseEntity, Unique, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ComputingQueueStatus } from './computing.enum';
import { Account } from '../accounts/account.entity';

@Entity()
@Unique(['id'])
export class ComputingQueue extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  script: string;

  @Column()
  cpu: number;

  @Column()
  maxRamPerProcess: number;

  @Column({
    type: 'enum',
    enum: ComputingQueueStatus,
    default: ComputingQueueStatus.PENDING
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
