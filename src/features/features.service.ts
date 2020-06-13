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
import { CreateVirtualMachineRequestDto } from './dto/create-virtual-machine-request.dto';
import { VirtualMachineRepository, VirtualMachineVpsRepository } from '../virtual-machines/virtual-machine.repository';
import { VpsStatus, VpsApproveStatus } from '../virtual-machines/vps-status.enum';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(FeatureRequestRepository)
    @InjectRepository(StorageRepository)
    @InjectRepository(StorageFolderRepository)
    @InjectRepository(ComputingRepository)
    @InjectRepository(VirtualMachineRepository)
    @InjectRepository(VirtualMachineVpsRepository)
    private featureRequestRepository: FeatureRequestRepository,
    private storageRepository: StorageRepository,
    private storageFolderRepository: StorageFolderRepository,
    private computingRepository: ComputingRepository,
    private virtualMachineRepository: VirtualMachineRepository,
    private virtualMachineVpsRepository: VirtualMachineVpsRepository,
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

  async createVirtualMachineRequest(
    account: Account,
    createVirtualMachineRequestDto: CreateVirtualMachineRequestDto
  ) {
    const isPending = await this.featureRequestRepository.findOne({
      account,
      status: FeatureRequestStatus.PENDING
    });
    if (isPending) {
      throw new ConflictException('Yêu cầu của bạn đang được phê duyệt');
    }
    return this.featureRequestRepository.createVirtualMachineRequest(
      account,
      createVirtualMachineRequestDto
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

      if (featureCode === FeatureCode.VIRTUAL_MACHINE) {
        const { vmCpu, vmRam, vmHdd, endDate } = featureRequest;
        await this.virtualMachineRepository.createVirtualMachine(
          featureRequest.account,
          endDate
        );
        await this.virtualMachineVpsRepository.createVps(
          featureRequest.account,
          vmCpu,
          vmRam,
          vmHdd,
          VpsStatus.UP,
          VpsApproveStatus.APPROVED
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

    const virtualMachineRequest = await this.featureRequestRepository.findOne(
      {
        account,
        featureCode: FeatureCode.VIRTUAL_MACHINE
      },
      {
        order: {
          id: 'DESC'
        }
      }
    );
    if (virtualMachineRequest) {
      returnResult.virtualMachineRequestStatus = virtualMachineRequest.status;
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
