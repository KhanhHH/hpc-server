import { IsNotEmpty, IsIn } from "class-validator";
import { FeatureStatus } from "../feature.enum";

export class UpdateApprovedComputingDto{
    @IsNotEmpty({message: "Số lõi không được để trống"})
    maxCpu: number;

    @IsNotEmpty({message: "Số RAM tối đa không được để trống"})
    maxRam: number;

    @IsNotEmpty({message: "Hạn sử dụng không được để trống"})
    endDate: Date;

    @IsIn([FeatureStatus.ACTIVE, FeatureStatus.DEACTIVE])
    status: string;
}