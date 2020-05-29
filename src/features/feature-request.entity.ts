import { Unique, Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne,  } from "typeorm";
import { Account } from "../accounts/account.entity";
import { Storage } from "../storages/storage.entity";

@Entity()
@Unique(['id'])
export class FeatureRequest extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    maxSize: number

    @Column()
    endDate: Date

    @ManyToOne(() => Storage, storage => storage.id)
    @JoinColumn()
    storage: Storage;

    @OneToOne(() => Account, account => account.id)
    @JoinColumn()
    account: Account;
}