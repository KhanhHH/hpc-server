import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Body,
  ParseIntPipe,
  Patch,
  Param
} from '@nestjs/common';
import { VirtualMachinesService } from './virtual-machines.service';
import { AuthGuard } from '@nestjs/passport';
import { GetAccount } from '../accounts/get-account.decorator';
import { Account } from '../accounts/account.entity';
import { UpdateVpsDto } from './dto/update-vps.dto';
import { CreateVpsDto } from './dto/create-vps.dto';

@Controller('virtual-machines')
export class VirtualMachinesController {
  constructor(private virtualMachinesService: VirtualMachinesService) {}

  @Get('me')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  getMyVirtualMachine(@GetAccount() account: Account) {
    return this.virtualMachinesService.getMyVirtualMachine(account);
  }

  @Get('vps/me')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  getMyVps(@GetAccount() account: Account) {
    return this.virtualMachinesService.getMyVps(account);
  }

  @Patch('vps/:vpsId')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  updateVps(
    @Param('vpsId', ParseIntPipe) vpsId: number,
    @Body() updateVpsDto: UpdateVpsDto,
    @GetAccount() account: Account
  ) {
    return this.virtualMachinesService.updateVps(account, vpsId, updateVpsDto);
  }

  @Post('vps')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  createMyVps(
    @Body() createVpsDto: CreateVpsDto,
    @GetAccount() account: Account
  ) {
    return this.virtualMachinesService.createMyVps(account, createVpsDto);
  }
}
