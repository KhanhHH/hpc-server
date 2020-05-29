import { Module } from '@nestjs/common';
import { AccountModule } from './accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { FeaturesModule } from './features/features.module';
import { StoragesModule } from './storages/storages.module';
import { ComputingsModule } from './computings/computings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AccountModule,
    FeaturesModule,
    StoragesModule,
    ComputingsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
