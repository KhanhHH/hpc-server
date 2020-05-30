import { Injectable } from '@nestjs/common';
import {
  CreateStorageRequestDto,
  UpdateFeatureRequestStatusDto,
  UpdateApprovedStorageDto
} from './dto';
import { FeatureRequestRepository } from './feature.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../accounts/account.entity';
import { StorageRepository } from '../storages/storage.repository';
import { FeatureRequestStatus } from './feature-request-status.enum';
import { FeatureCode } from './feature.enum';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(FeatureRequestRepository)
    @InjectRepository(StorageRepository)
    private featureRequestRepository: FeatureRequestRepository,
    private storageRepository: StorageRepository
  ) {}
  async createStorageRequest(
    account: Account,
    createStorageRequestDto: CreateStorageRequestDto
  ) {
    const createdRequest = await this.featureRequestRepository.createStorageRequest(
      account,
      createStorageRequestDto
    );

    if (createdRequest) {
      const requestList = await this.featureRequestRepository.find();
      return requestList;
    }
  }

  async updateFeatureRequestStatus(
    account: Account,
    id: number,
    updateFeatureRequestStatusDto: UpdateFeatureRequestStatusDto
  ) {
    const { status } = updateFeatureRequestStatusDto;
    const updatedFeatureRequest = await this.featureRequestRepository.updateFeatureRequestStatus(
      account,
      id,
      updateFeatureRequestStatusDto
    );
    if (status === FeatureRequestStatus.APPROVED) {
      const { featureCode } = updatedFeatureRequest;
      if (featureCode === FeatureCode.STORAGE) {
        const { maxSize, endDate } = updatedFeatureRequest;
        await this.storageRepository.createStorage(account, maxSize, endDate);
      }
    }
    const requestList = await this.featureRequestRepository.find();
    return requestList;
  }

  async getAllFeatureRequest() {
    const allFeatureRequest = await this.featureRequestRepository.find();
    return allFeatureRequest;
  }

  async getAllAprrovedFeature() {
    const allAprrovedStorageFeature = await this.storageRepository.find();
    allAprrovedStorageFeature.map(item => {
        delete item.account.password;
    })
    return {
      storage: allAprrovedStorageFeature
    };
  }

  async updateApprovedStorage(
    id: number,
    updateApprovedStorageDto: UpdateApprovedStorageDto
  ) {
    await this.storageRepository.updateApprovedStorage(
      id,
      updateApprovedStorageDto
    );
    const allApproveFeture = await this.getAllAprrovedFeature();
    return allApproveFeture;
  }
}
