import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';
import { AccountModule } from '../accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureRequest } from './feature-request.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([FeatureRequest]), AccountModule],
  providers: [FeaturesService],
  controllers: [FeaturesController],
})
export class FeaturesModule {}
