import { Unique, Entity, BaseEntity, PrimaryColumn } from "typeorm";

@Entity()
@Unique(['id'])
export class Feature extends BaseEntity {
    @PrimaryColumn()
    id: string
}