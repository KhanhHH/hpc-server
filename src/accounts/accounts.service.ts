import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from './account.repository';
import { CreateAccountDto, LoginAccountDto, UpdateAccountDto } from './dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountRepository)
    private accountRepository: AccountRepository,
    private jwtService: JwtService,
  ) {}

  async login(loginAccountDto: LoginAccountDto) {
    const { email, password } = loginAccountDto;
    const foundUser = await this.accountRepository.findOne({ email });
    if (!foundUser) {
      throw new UnauthorizedException();
    }
    const isValid = await this.accountRepository.validatePassword(
      password,
      foundUser.password,
    );

    if (!isValid) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayload = {
      id: foundUser.id,
      email: foundUser.email,
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  createAccount(createAccountDto: CreateAccountDto) {
    return this.accountRepository.createAccount(createAccountDto);
  }

  async getAllAccount(){
    const accountList = await this.accountRepository.find();
    return accountList;
  }

  async getAccountById(id: number) {
    const found = await this.accountRepository.findOne({ id });
    if (!found) {
      throw new NotFoundException(`Không tìm thấy tài khoản`);
    }
    const { email, name, phone, workplace, type, status } = found;

    const user = { id, email, name, phone, workplace, type, status };

    return user;
  }

  async updateAccount(id: number, updateAccountDto: UpdateAccountDto){
    const found = await this.accountRepository.findOne({ id });
    if (!found) {
      throw new NotFoundException(`Không tìm thấy tài khoản`);
    }
    const isUpdated = await this.accountRepository.updateAccount(id, updateAccountDto);
    if (isUpdated){
      const updatedAccount = await this.accountRepository.findOne({ id });
      return updatedAccount;
    }
  }


}
