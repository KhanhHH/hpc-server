import { EntityRepository, Repository } from 'typeorm';
import { Storage } from './storage.entity';

@EntityRepository(Storage)
export class StorageRepository extends Repository<Storage> {

}
