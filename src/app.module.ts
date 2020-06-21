import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AccountModule } from './accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeaturesModule } from './features/features.module';
import { StoragesModule } from './storages/storages.module';
import { ComputingsModule } from './computings/computings.module';
import { VirtualMachinesModule } from './virtual-machines/virtual-machines.module';
import {} from './accounts/account.entity'
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity.{js,ts}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AccountModule,
    FeaturesModule,
    StoragesModule,
    ComputingsModule,
    VirtualMachinesModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
