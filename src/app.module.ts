import { Module } from '@nestjs/common';
import { AccountModule } from './accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { FeaturesModule } from './features/features.module';
import { StoragesModule } from './storages/storages.module';
import { ComputingsModule } from './computings/computings.module';
import { VirtualMachinesModule } from './virtual-machines/virtual-machines.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AccountModule,
    FeaturesModule,
    StoragesModule,
    ComputingsModule,
    VirtualMachinesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
