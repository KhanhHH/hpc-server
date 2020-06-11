import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards, UseInterceptors, ClassSerializerInterceptor, Patch, ParseIntPipe, Param, Get } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { CreateStorageRequestDto, UpdateFeatureRequestStatusDto, UpdateApprovedStorageDto, CreateComputingRequestDto } from './dto';
import { GetAccount } from '../accounts/get-account.decorator';
import { Account } from '../accounts/account.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateApprovedComputingDto } from './dto/update-approved-computing.dto';

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

  @Post('request-computing')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  createComputingRequest(
    @Body()  createComputingRequestDto: CreateComputingRequestDto,
    @GetAccount() account: Account
  ) {
    return this.featuresService.createComputingRequest(account, createComputingRequestDto);
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

  @Get('requests/my-status')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  getMyFeature(
    @GetAccount() account: Account
  ) {
    return this.featuresService.getMyFeatureStatus(account);
  }

  @Get('approved/storage')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  getAllAprrovedStorage(){
    return this.featuresService.getAllAprrovedStorage();
  }

  @Get('approved/computing')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  getAllApprovedComputing(){
    return this.featuresService.getAllAprrovedComputing();
  }

  @Patch('approved/storage/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  updateApprovedStorage(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateApprovedStorageDto: UpdateApprovedStorageDto,
  ){
    return this.featuresService.updateApprovedStorage(id, updateApprovedStorageDto);
  }

  @Patch('approved/computing/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  updateApprovedComputing(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateApprovedComputingDto: UpdateApprovedComputingDto,
  ){
    return this.featuresService.updateApprovedComputing(id, updateApprovedComputingDto);
  }


}
