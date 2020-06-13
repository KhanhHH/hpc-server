import { IsIn, IsOptional } from 'class-validator';
import { VpsStatus, VpsApproveStatus } from '../vps-status.enum';

export class UpdateVpsDto {
  @IsOptional()
  cpu: number;

  @IsOptional()
  ram: number;

  @IsOptional()
  hdd: number;

  @IsOptional()
  @IsIn([VpsStatus.DOWN, VpsStatus.UP])
  status: string;

  @IsOptional()
  @IsIn([
    VpsApproveStatus.APPROVED,
    VpsApproveStatus.PENDING,
    VpsApproveStatus.REJECTED
  ])
  approveStatus: string;
}
