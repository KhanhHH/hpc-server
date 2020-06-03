import { Unique, Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne,  } from "typeorm";
import { Account } from "../accounts/account.entity";
import { FeatureRequestStatus } from "./feature-request-status.enum";
import { FeatureCode } from "./feature.enum";

@Entity()
@Unique(['id'])
export class FeatureRequest extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'bigint' })
    maxSize: number

    @Column()
    endDate: Date

    @Column({
        type: "enum",
        enum: FeatureCode,
    })
    featureCode: string

    @Column({
        type: "enum",
        enum: FeatureRequestStatus,
        default: FeatureRequestStatus.PENDING
    })
    status: string

    @ManyToOne(() => Account, account => account.id , {eager: true})
    @JoinColumn()
    account: Account;
}