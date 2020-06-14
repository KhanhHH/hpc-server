import { EntityRepository, Repository } from 'typeorm';
import { VirtualMachine } from './virtual-machine.entity';
import { VirtualMachineVps } from './virtual-machine-vps.entity';
import { FeatureStatus } from '../features/feature.enum';
import { VpsStatus, VpsApproveStatus } from './vps-status.enum';
import { ConflictException } from '@nestjs/common';
import { Account } from '../accounts/account.entity';
import { UpdateVpsDto } from './dto/update-vps.dto';

@EntityRepository(VirtualMachine)
export class VirtualMachineRepository extends Repository<VirtualMachine> {
  async createVirtualMachine(account: Account, endDate: Date) {
    const virtualMachine = new VirtualMachine();
    virtualMachine.startDate = new Date();
    virtualMachine.endDate = endDate;
    virtualMachine.status = FeatureStatus.ACTIVE;
    virtualMachine.account = account;
    try {
      await virtualMachine.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Tài khoản đã sử dụng dịch vụ này');
      }
    }
    return virtualMachine;
  }
}

@EntityRepository(VirtualMachineVps)
export class VirtualMachineVpsRepository extends Repository<VirtualMachineVps> {
  async createVps(
    account: Account,
    cpu: number,
    ram: number,
    hdd: number,
    status?: string,
    approveStatus?: string
  ) {
    const vps = new VirtualMachineVps();
    vps.cpu = cpu;
    vps.ram = ram;
    vps.hdd = hdd;

    if (status) {
      vps.status = status;
    }
    if (approveStatus) {
      vps.approveStatus = approveStatus;
    }

    vps.account = account;
    await vps.save();
    return vps;
  }

  async updateVps(account: Account, vpsId: number, updateVpsDto: UpdateVpsDto) {
    const { approveStatus } = updateVpsDto;
    if (approveStatus && approveStatus === VpsApproveStatus.APPROVED) {
      updateVpsDto.status = VpsStatus.UP;
    }
    await this.update({ id: vpsId }, updateVpsDto);
    const updated = await this.findOne({ id: vpsId });
    return updated;
  }
}
