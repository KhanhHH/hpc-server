import { Repository, EntityRepository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';

import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { LoginAccountDto } from './dto/login-account.dto';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
  async createAccount(createAccountDto: CreateAccountDto) {
    const { email, password, name, phone, workplace, type, status } = createAccountDto;
    const account = new Account();

    account.email = email;
    account.name = name;
    account.phone = phone;
    account.workplace = workplace;
    account.type = type;
    account.status = status;
    account.password = await bcrypt.hash(password, 10);

    try {
      await account.save();
    } catch (error) {
      if (error.code === '23505'){
        throw new ConflictException('Email này đã tồn tại');
      }
    }
    return account;
  }

  async validatePassword(password:string , hashedPassword:string){
    const compare = await bcrypt.compare(password, hashedPassword);
    return compare;
  }
}
