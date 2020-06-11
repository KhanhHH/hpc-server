import { Injectable } from '@nestjs/common';
import {
  ComputingQueueRepository,
  ComputingRepository
} from './computing.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../accounts/account.entity';
import { CreateComputingQueueDto } from './dto/create-computing-queue.dto';
import { ComputingQueueStatus } from './computing.enum';
import { UpdateComputingQueueStatusDto } from './dto/update-computing-queue-status.dto';

@Injectable()
export class ComputingsService {
  constructor(
    @InjectRepository(ComputingQueueRepository)
    @InjectRepository(ComputingRepository)
    private computingQueueRepository: ComputingQueueRepository,
    private computingRepository: ComputingRepository
  ) {}
  async getMyComputing(account: Account) {
    return this.computingRepository.findOne({ account });
  }

  async createComputingQueue(
    account: Account,
    createComputingQueueDto: CreateComputingQueueDto
  ) {
    return this.computingQueueRepository.createComputingQueue(
      account,
      createComputingQueueDto
    );
  }

  async getAllComputingQueue() {
    return this.computingQueueRepository.find({
      order: {
        id: 'DESC'
      }
    });
  }

  async getMyComputingQueue(account: Account) {
    return this.computingQueueRepository.find({
      where: { account },
      order: {
        id: 'DESC'
      }
    });
  }

  async updateComputingQueueStatus(
    account: Account,
    id: number,
    updateComputingQueueStatusDto: UpdateComputingQueueStatusDto
  ) {
    return this.computingQueueRepository.updateComputingQueueStatus(
      account,
      id,
      updateComputingQueueStatusDto
    );
  }
}
