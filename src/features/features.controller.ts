import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards, UseInterceptors, ClassSerializerInterceptor, Patch, ParseIntPipe, Param, Get } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { CreateStorageRequestDto, UpdateFeatureRequestStatusDto, UpdateApprovedStorageDto } from './dto';
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

  @Get('requests')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  getAllFeatureRequest() {
    return this.featuresService.getAllFeatureRequest();
  }

  @Get('approved')
  @UseGuards(AuthGuard())
  getAllApprovedFeature(){
    return this.featuresService.getAllAprrovedFeature();
  }

  @Patch('approved-storage/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  updateApprovedStorage(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateApprovedStorageDto: UpdateApprovedStorageDto,
  ){
    return this.featuresService.updateApprovedStorage(id, updateApprovedStorageDto);
  }


}
