import { Module } from '@nestjs/common';
import { ComputingsController } from './computings.controller';
import { ComputingsService } from './computings.service';

@Module({
  controllers: [ComputingsController],
  providers: [ComputingsService]
})
export class ComputingsModule {}
