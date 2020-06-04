import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BaseEntity,
  ManyToOne
} from 'typeorm';
import { Account } from '../accounts/account.entity';

@Entity()
@Unique(['id'])
export class StorageFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalname: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column()
  mimetype: string;

  @Column()
  uploadDate: Date;

  @ManyToOne(() => Account, account => account.id , {eager: false})
  account: Account;

}
