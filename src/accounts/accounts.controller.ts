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
  Patch,
} from '@nestjs/common';
import { AccountService } from './accounts.service';
import { CreateAccountDto, LoginAccountDto, UpdateAccountDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('login')
  login(@Body() loginAccountDto: LoginAccountDto) {
    return this.accountService.login(loginAccountDto);
  }

  @Post('')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.createAccount(createAccountDto);
  }

  @Get('')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  getAllAccount() {
    return this.accountService.getAllAccount();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  getAccountById(@Param('id', ParseIntPipe) id: number) {
    return this.accountService.getAccountById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountService.updateAccount(id, updateAccountDto);
  }
}
