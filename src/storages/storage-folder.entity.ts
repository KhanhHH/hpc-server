import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BaseEntity,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn
} from 'typeorm';
import { FolderType } from './storage-folder.enum';
import { StorageFile } from './storage-file.entity';
import { Account } from '../accounts/account.entity';

@Entity()
@Unique(['id'])
export class StorageFolder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: FolderType
  })
  folderType: string;

  @Column({
    default: ''
  })
  name: string;

  @Column({ type: 'int', array: true, default: "{}" })
  childFiles: number[];

  @Column({ type: 'int', array: true, default: "{}" })
  childFolders: number[];

  // @OneToMany(() => StorageFile, storageFile => storageFile.id)
  // @Column({ default: null, nullable: true })
  // @JoinColumn()
  // childFiles: number[];

  // @OneToMany(() => StorageFolder, storageFolder => storageFolder.id)
  // @Column({ default: null, nullable: true })
  // @JoinColumn()
  // childFolder: number[];

  @ManyToOne(
    () => Account,
    account => account.id,
    { eager: false }
  )
  account: Account;
}
