import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards, UseInterceptors, ClassSerializerInterceptor, Patch, ParseIntPipe, Param } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { CreateStorageRequestDto, UpdateFeatureRequestStatusDto } from './dto';
import { GetAccount } from '../accounts/get-account.decorator';
import { Account } from '../accounts/account.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('features')
export class FeaturesController {
  constructor(private featuresService: FeaturesService) {}

  @Post('request-storage')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  createFeatureRequest(
    @Body() createStorageRequestDto: CreateStorageRequestDto,
    @GetAccount() account: Account
  ) {
    return this.featuresService.createStorageRequest(account, createStorageRequestDto);
  }

  @Patch('requests/:id/status')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  updateFeatureRequestStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFeatureRequestStatusDto: UpdateFeatureRequestStatusDto,
    @GetAccount() account: Account
  ) {
    return this.featuresService.updateFeatureRequestStatus(account, id, updateFeatureRequestStatusDto);
  }
}
