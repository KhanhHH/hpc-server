import { EntityRepository, Repository } from 'typeorm';
import { FeatureRequest } from './feature-request.entity';

@EntityRepository(FeatureRequest)
export class FeatureRequestRepository extends Repository<FeatureRequest> {

}
