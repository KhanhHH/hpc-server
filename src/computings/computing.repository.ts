import { EntityRepository, Repository, UpdateDateColumn } from 'typeorm';
import { Computing } from './computing.entity';
import { FeatureStatus } from '../features/feature.enum';
import { Account } from '../accounts/account.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateApprovedComputingDto } from '../features/dto/update-approved-computing.dto';
import { ComputingQueue } from './computing-queue.entity';
import { CreateComputingQueueDto } from './dto/create-computing-queue.dto';
import { UpdateComputingQueueStatusDto } from './dto/update-computing-queue-status.dto';

@EntityRepository(Computing)
export class ComputingRepository extends Repository<Computing> {
  async createComputing(
    account: Account,
    userType:string,
    maxCpu: number,
    maxRam: number,
    endDate: Date
  ) {
    const computing = new Computing();
    computing.startDate = new Date();
    computing.endDate = endDate;
    computing.userType = userType;
    computing.maxCpu = maxCpu;
    computing.maxRam = maxRam;
    computing.status = FeatureStatus.ACTIVE;
    computing.account = account;
    try {
      await computing.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Tài khoản đã sử dụng dịch vụ này');
      }
    }
    return computing;
  }

  async updateApprovedComputing(
    id: number,
    updateApprovedComputingDto: UpdateApprovedComputingDto
  ) {
    const { maxCpu, maxRam, endDate, status } = updateApprovedComputingDto;
    await this.createQueryBuilder()
      .update(Computing)
      .set({ maxCpu, maxRam, endDate, status })
      .where('id = :id', { id })
      .execute();

    const updated = await this.findOne({ id });
    if (!updated) {
      throw new NotFoundException('Dịch vụ ttính toán này không tồn tại');
    }
    return updated;
  }
}

@EntityRepository(ComputingQueue)
export class ComputingQueueRepository extends Repository<ComputingQueue> {
  async createComputingQueue(
    account: Account,
    createComputingQueueDto: CreateComputingQueueDto
  ) {
    const { script, cpu, maxRamPerProcess } = createComputingQueueDto;
    const queue = new ComputingQueue();
    queue.script = script;
    queue.cpu = cpu;
    queue.maxRamPerProcess = maxRamPerProcess;
    queue.account = account;
    const created = await queue.save();
    return created;
  }
  async updateComputingQueueStatus(
    account: Account,
    id: number,
    updateComputingQueueStatusDto: UpdateComputingQueueStatusDto
  ) {
    const { status } = updateComputingQueueStatusDto;
    const queue = await ComputingQueue.findOne({ id, account });
    queue.status = status;
    const updated = queue.save();
    return updated;
  }
}
