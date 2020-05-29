import { Repository, EntityRepository, getConnection } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto, UpdateAccountDto } from './dto';

import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
  async createAccount(createAccountDto: CreateAccountDto) {
    const {
      email,
      password,
      name,
      phone,
      workplace,
      type,
      status,
    } = createAccountDto;
    const account = new Account();
    const hashedPassword = await this.hashPassword(password);

    account.email = email;
    account.name = name;
    account.phone = phone;
    account.workplace = workplace;
    account.type = type;
    account.status = status;
    account.password = hashedPassword;

    try {
      await account.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email này đã tồn tại');
      }
    }
    return account;
  }

  async hashPassword(password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
  }

  async validatePassword(password: string, hashedPassword: string) {
    const compare = await bcrypt.compare(password, hashedPassword);
    return compare;
  }

  async updateAccount(id: number, updateAccountDto: UpdateAccountDto) {
    const { password, name, phone, workplace, type, status } = updateAccountDto;

    if (password) {
      const hashedPassword = await this.hashPassword(password);
      await getConnection()
        .createQueryBuilder()
        .update(Account)
        .set({
          password: hashedPassword,
          name,
          phone,
          workplace,
          type,
          status,
        })
        .where('id = :id', { id })
        .execute();
    } else {
      await getConnection()
        .createQueryBuilder()
        .update(Account)
        .set({
          name,
          phone,
          workplace,
          type,
          status,
        })
        .where('id = :id', { id })
        .execute();
    }

    return true;
  }
}
