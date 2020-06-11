import { Injectable, ConflictException } from '@nestjs/common';
import {
  CreateStorageRequestDto,
  UpdateFeatureRequestStatusDto,
  UpdateApprovedStorageDto,
  CreateComputingRequestDto
} from './dto';
import { FeatureRequestRepository } from './feature.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../accounts/account.entity';
import { StorageRepository, StorageFolderRepository } from '../storages/storage.repository';
import { FeatureRequestStatus } from './feature-request-status.enum';
import { FeatureCode } from './feature.enum';
import { ComputingRepository } from '../computings/computing.repository';
import { UpdateApprovedComputingDto } from './dto/update-approved-computing.dto';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(FeatureRequestRepository)
    @InjectRepository(StorageRepository)
    @InjectRepository(StorageFolderRepository)
    @InjectRepository(ComputingRepository)
    private featureRequestRepository: FeatureRequestRepository,
    private storageRepository: StorageRepository,
    private storageFolderRepository: StorageFolderRepository,
    private computingRepository: ComputingRepository
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

  async createComputingRequest(
    account: Account,
    createComputingRequestDto: CreateComputingRequestDto
  ) {
    const isPending = await this.featureRequestRepository.findOne({
      account,
      status: FeatureRequestStatus.PENDING
    });
    if (isPending) {
      throw new ConflictException('Yêu cầu của bạn đang được phê duyệt');
    }
    return this.featureRequestRepository.createComputingRequest(
      account,
      createComputingRequestDto
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
        await this.storageFolderRepository.createRootFolder(featureRequest.account);
      }

      if (featureCode === FeatureCode.COMPUTING) {
        const { userType, maxCpu, maxRam, endDate } = featureRequest;
        await this.computingRepository.createComputing(
          featureRequest.account,
          userType,
          maxCpu,
          maxRam,
          endDate
        );
      }
    } 
    await this.featureRequestRepository.updateFeatureRequestStatus(
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

    const computingRequest = await this.featureRequestRepository.findOne(
      {
        account,
        featureCode: FeatureCode.COMPUTING
      },
      {
        order: {
          id: 'DESC'
        }
      }
    );
    if (computingRequest) {
      returnResult.computingRequestStatus = computingRequest.status;
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

  async getAllAprrovedComputing() {
    const allAprrovedComputing = await this.computingRepository.find({
      order: {
        id: 'DESC'
      }
    });
    return allAprrovedComputing;
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

  async updateApprovedComputing(
    id: number,
    updateApprovedComputingDto: UpdateApprovedComputingDto
  ) {
   await this.computingRepository.updateApprovedComputing(
      id,
      updateApprovedComputingDto
    );
    return this.getAllAprrovedComputing();
  }
}
