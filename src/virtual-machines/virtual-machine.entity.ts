import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn, Unique, JoinColumn } from 'typeorm';
import { FeatureStatus } from '../features/feature.enum';
import { Account } from '../accounts/account.entity';

@Entity()
@Unique(['id'])
export class VirtualMachine extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

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
