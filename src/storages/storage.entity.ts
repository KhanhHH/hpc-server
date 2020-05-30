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

  @OneToOne(
    () => Account,
    account => account.id, {eager: false}
  )
  @JoinColumn()
  account: Account;
}
