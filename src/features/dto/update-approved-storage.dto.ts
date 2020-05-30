import { IsNotEmpty, Min, IsIn } from "class-validator";
import { FeatureStatus } from "../feature.enum";

export class UpdateApprovedStorageDto{
    @Min(1, { message: "Dung lượng không hợp lệ"})
    @IsNotEmpty({message: "Dung lượng không được để trống"})
    maxSize: number;

    @IsNotEmpty({message: "Hạn sử dụng không được để trống"})
    endDate: Date;

    @IsIn([FeatureStatus.ACTIVE, FeatureStatus.DEACTIVE])
    status: string;
}