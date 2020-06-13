import { EntityRepository, Repository } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { CreateStorageRequestDto, UpdateFeatureRequestStatusDto, CreateComputingRequestDto } from './dto';
import { FeatureRequest } from './feature-request.entity';
import { Feature } from './feature.entity';
import { FeatureCode } from './feature.enum';
import { CreateVirtualMachineRequestDto } from './dto/create-virtual-machine-request.dto';

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

  async createComputingRequest(
    account: Account,
    createComputingRequestDto: CreateComputingRequestDto
  ){
    const { userType, maxCpu, maxRam, endDate} = createComputingRequestDto;
    const featureRequest = new FeatureRequest();
    featureRequest.featureCode = FeatureCode.COMPUTING;
    featureRequest.userType = userType;
    featureRequest.maxCpu = maxCpu;
    featureRequest.maxRam = maxRam;
    featureRequest.endDate = endDate;
    featureRequest.account = account;
    const created = await featureRequest.save();
    return created;
  }

  async createVirtualMachineRequest(
    account: Account,
    createVirtualMachineRequestDto: CreateVirtualMachineRequestDto
  ){
    const { cpu, ram, hdd, endDate} = createVirtualMachineRequestDto;
    const featureRequest = new FeatureRequest();
    featureRequest.featureCode = FeatureCode.VIRTUAL_MACHINE;
    featureRequest.vmCpu = cpu;
    featureRequest.vmRam = ram;
    featureRequest.vmHdd = hdd;
    featureRequest.endDate = endDate;
    featureRequest.account = account;
    const created = await featureRequest.save();
    return created;
  }
}
@EntityRepository(Feature)
export class FeatureRepository extends Repository<Feature> {
  test() {
    console.log('helloworld');
  }
}
