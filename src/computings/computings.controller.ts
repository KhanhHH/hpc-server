import {
  Controller,
  UsePipes,
  UseGuards,
  Post,
  ValidationPipe,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Patch,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetAccount } from '../accounts/get-account.decorator';
import { CreateComputingQueueDto } from './dto/create-computing-queue.dto';
import { ComputingsService } from './computings.service';
import { Account } from '../accounts/account.entity';
import { UpdateComputingQueueStatusDto } from './dto/update-computing-queue-status.dto';

@Controller('computings')
export class ComputingsController {
  constructor(private computingsService: ComputingsService) {}
  @Get('me')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  getMyComputing(@GetAccount() account: Account) {
    return this.computingsService.getMyComputing(account);
  }

  @Post('queue')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  createComputingQueue(
    @Body() createComputingQueueDto: CreateComputingQueueDto,
    @GetAccount() account: Account
  ) {
    return this.computingsService.createComputingQueue(
      account,
      createComputingQueueDto
    );
  }

  @Get('queue')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  getAllComputingQueue() {
    return this.computingsService.getAllComputingQueue();
  }

  @Get('queue/me')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  getMyComputingQueue(@GetAccount() account: Account) {
    return this.computingsService.getMyComputingQueue(account);
  }

  @Patch('queue/:id/status')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  updateComputingQueueStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComputingQueueStatusDto: UpdateComputingQueueStatusDto,
    @GetAccount() account: Account
  ) {
    return this.computingsService.updateComputingQueueStatus(
      account,
      id,
      updateComputingQueueStatusDto
    );
  }
}
