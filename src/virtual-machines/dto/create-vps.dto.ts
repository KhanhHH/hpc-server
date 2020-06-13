import { IsOptional } from 'class-validator';

export class CreateVpsDto {
  @IsOptional()
  cpu: number;

  @IsOptional()
  ram: number;

  @IsOptional()
  hdd: number;
}
