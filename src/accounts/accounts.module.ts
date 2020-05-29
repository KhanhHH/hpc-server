import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './accounts.controller';
import { AccountRepository } from './account.repository';
import { AccountService } from './accounts.service';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    TypeOrmModule.forFeature([AccountRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: "90d",
      },
    }),
  ],
  controllers: [AccountController],
  providers: [AccountService, JwtStrategy],
  exports: [
    JwtStrategy,
    PassportModule,
  ],
})
export class AccountModule {}
