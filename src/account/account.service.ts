import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from './account.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginAccountDto } from './dto/login-account.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountRepository)
    private accountRepository: AccountRepository,
    private jwtService: JwtService,
  ) {}

  createAccount(createAccountDto: CreateAccountDto) {
    return this.accountRepository.createAccount(createAccountDto);
  }

  async getAccountById(id: number) {
    const found = await this.accountRepository.findOne({ id });
    if (!found) {
      throw new NotFoundException(`Không tìm thấy tài khoản ${id} `);
    }
    const { email, name, phone, workplace, type, status } = found;

    const user = { id, email, name, phone, workplace, type, status };

    return user;
  }

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
}
