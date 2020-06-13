import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { Account } from '../accounts/account.entity';
import { VpsStatus, VpsApproveStatus} from './vps-status.enum'

@Entity()
@Unique(['id'])
export class VirtualMachineVps extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cpu: number;

  @Column({
    type: 'bigint'
  })
  ram: number;

  @Column({
    type: 'bigint'
  })
  hdd: number;

  @Column({
    type: 'enum',
    enum: VpsStatus,
    default: VpsStatus.DOWN
  })
  status: string;

  @Column({
    type: 'enum',
    enum: VpsApproveStatus,
    default: VpsApproveStatus.PENDING
  })
  approveStatus: string;

  @ManyToOne(
    () => Account,
    account => account.id,
    { eager: true }
  )
  @JoinColumn()
  account: Account;
}
