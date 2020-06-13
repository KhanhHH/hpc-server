import { Module } from '@nestjs/common';
import { VirtualMachinesService } from './virtual-machines.service';
import { VirtualMachinesController } from './virtual-machines.controller';
import { AccountModule } from '../accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualMachineRepository, VirtualMachineVpsRepository } from './virtual-machine.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VirtualMachineRepository,
      VirtualMachineVpsRepository
    ]),
    AccountModule
  ],
  providers: [VirtualMachinesService],
  controllers: [VirtualMachinesController]
})
export class VirtualMachinesModule {}
