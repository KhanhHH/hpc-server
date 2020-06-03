import { Injectable, ConflictException } from '@nestjs/common';
import {
  CreateStorageRequestDto,
  UpdateFeatureRequestStatusDto,
  UpdateApprovedStorageDto
} from './dto';
import { FeatureRequestRepository } from './feature.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../accounts/account.entity';
import { StorageRepository, StorageFolderRepository } from '../storages/storage.repository';
import { FeatureRequestStatus } from './feature-request-status.enum';
import { FeatureCode } from './feature.enum';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(FeatureRequestRepository)
    @InjectRepository(StorageRepository)
    @InjectRepository(StorageFolderRepository)
    private featureRequestRepository: FeatureRequestRepository,
    private storageRepository: StorageRepository,
    private storageFolderRepository: StorageFolderRepository
  ) {}
  async createStorageRequest(
    account: Account,
    createStorageRequestDto: CreateStorageRequestDto
  ) {
    const isPending = await this.featureRequestRepository.findOne({
      account,
      status: FeatureRequestStatus.PENDING
    });
    if (isPending) {
      throw new ConflictException('Yêu cầu của bạn đang được phê duyệt');
    }
    return this.featureRequestRepository.createStorageRequest(
      account,
      createStorageRequestDto
    );
  }

  async updateFeatureRequestStatus(
    account: Account,
    id: number,
    updateFeatureRequestStatusDto: UpdateFeatureRequestStatusDto
  ) {
    const { status } = updateFeatureRequestStatusDto;
    if (status === FeatureRequestStatus.APPROVED) {
      const featureRequest =  await this.featureRequestRepository.findOne({id});
      const { featureCode } = featureRequest;
      if (featureCode === FeatureCode.STORAGE) {
        const { maxSize, endDate } = featureRequest;
        await this.storageRepository.createStorage(
          featureRequest.account,
          maxSize,
          endDate
        );
        await this.storageFolderRepository.createRootFolder(account);
      }
    } 
    await this.featureRequestRepository.updateFeatureRequestStatus(
      account,
      id,
      updateFeatureRequestStatusDto
    );
    const requestList = await this.featureRequestRepository.find();
    return requestList;
  }

  async getMyFeatureStatus(account: Account) {
    const returnResult = {
      storageRequestStatus: null,
      computingRequestStatus: null,
      virtualMachineRequestStatus: null
    };
    const storageRequest = await this.featureRequestRepository.findOne(
      {
        account,
        featureCode: FeatureCode.STORAGE
      },
      {
        order: {
          id: 'DESC'
        }
      }
    );
    if (storageRequest) {
      returnResult.storageRequestStatus = storageRequest.status;
    }
    return returnResult;
  }

  async getAllFeatureRequest() {
    const allFeatureRequest = await this.featureRequestRepository.find({
      order: {
        id: 'DESC'
      }
    });
    return allFeatureRequest;
  }

  async getAllAprrovedStorage() {
    const allAprrovedStorage = await this.storageRepository.find({
      order: {
        id: 'DESC'
      }
    });
    return allAprrovedStorage;
  }

  async updateApprovedStorage(
    id: number,
    updateApprovedStorageDto: UpdateApprovedStorageDto
  ) {
   await this.storageRepository.updateApprovedStorage(
      id,
      updateApprovedStorageDto
    );
    return this.getAllAprrovedStorage();
  }
}
