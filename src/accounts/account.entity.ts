import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['email'])
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  workplace: string;

  @Column()
  type:string;

  @Column()
  status: string;

}
