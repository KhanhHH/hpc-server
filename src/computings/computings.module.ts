import { Module } from '@nestjs/common';
import { ComputingsController } from './computings.controller';
import { ComputingsService } from './computings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../accounts/accounts.module';
import {
  ComputingRepository,
  ComputingQueueRepository
} from './computing.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComputingRepository, ComputingQueueRepository]),
    AccountModule
  ],
  controllers: [ComputingsController],
  providers: [ComputingsService]
})
export class ComputingsModule {}
