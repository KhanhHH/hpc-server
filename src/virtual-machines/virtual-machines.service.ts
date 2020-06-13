import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  VirtualMachineRepository,
  VirtualMachineVpsRepository
} from './virtual-machine.repository';
import { Account } from '../accounts/account.entity';
import { UpdateVpsDto } from './dto/update-vps.dto';
import { CreateVpsDto } from './dto/create-vps.dto';

@Injectable()
export class VirtualMachinesService {
  constructor(
    @InjectRepository(VirtualMachineRepository)
    @InjectRepository(VirtualMachineVpsRepository)
    private virtualMachineRepository: VirtualMachineRepository,
    private virtualMachineVpsRepository: VirtualMachineVpsRepository
  ) {}
  async getMyVirtualMachine(account: Account) {
    return this.virtualMachineRepository.findOne({ account });
  }
  async getMyVps(account: Account) {
    return this.virtualMachineVpsRepository.find({ account });
  }

  async createMyVps(account: Account, createVpsDto: CreateVpsDto) {
    const { cpu, ram, hdd } = createVpsDto;
    return this.virtualMachineVpsRepository.createVps(account, cpu, ram, hdd);
  }

  async updateVps(account: Account, vpsId: number, updateVpsDto: UpdateVpsDto) {
    return this.virtualMachineVpsRepository.updateVps(
      account,
      vpsId,
      updateVpsDto
    );
  }
}
