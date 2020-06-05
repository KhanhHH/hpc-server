import { EntityRepository, Repository } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { CreateStorageRequestDto, UpdateFeatureRequestStatusDto } from './dto';
import { FeatureRequest } from './feature-request.entity';
import { Feature } from './feature.entity';
import { FeatureCode } from './feature.enum';

@EntityRepository(FeatureRequest)
export class FeatureRequestRepository extends Repository<FeatureRequest> {
  async createStorageRequest(
    account: Account,
    createStorageRequestDto: CreateStorageRequestDto
  ) {
    const { maxSize, endDate } = createStorageRequestDto;
    const featureRequest = new FeatureRequest();
    featureRequest.featureCode = FeatureCode.STORAGE;
    featureRequest.maxSize = maxSize;
    featureRequest.endDate = endDate;
    featureRequest.account = account;
    await featureRequest.save();
    return featureRequest;
  }

  async updateFeatureRequestStatus(
    id: number,
    updateFeatureRequestStatusDto: UpdateFeatureRequestStatusDto
  ){
    const { status } = updateFeatureRequestStatusDto;
    await this.createQueryBuilder()
      .update(FeatureRequest)
      .set({ status })
      .where('id = :id', { id })
      .execute();

    const updated = this.findOne({id});
    return updated;
    
  }
}
@EntityRepository(Feature)
export class FeatureRepository extends Repository<FeatureRequest> {
  test() {
    console.log('helloworld');
  }
}
