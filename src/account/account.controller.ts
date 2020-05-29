import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginAccountDto } from './dto/login-account.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}
  @Get('list')
  @UseGuards(AuthGuard())
  getAccounts(): string {
    return 'Hello mother fucker';
  }

  @Post('add')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.createAccount(createAccountDto);
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  getAccountById(
    @Param('id', ParseIntPipe) id: number
  ){
    return this.accountService.getAccountById(id);
  }

  @Post('login')
  login(@Body() loginAccountDto: LoginAccountDto) {
    return this.accountService.login(loginAccountDto);
  }
}
