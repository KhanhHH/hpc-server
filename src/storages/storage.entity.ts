import { Unique, Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn,  } from "typeorm";
import { Account } from "../accounts/account.entity";

@Entity()
@Unique(['id'])
export class Storage extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    currentSize: number

    @Column()
    maxSize: number

    @Column()
    startDate: Date

    @Column()
    endDate: Date

    @OneToOne(() => Account, account => account.id)
    @JoinColumn()
    account: Account;
}