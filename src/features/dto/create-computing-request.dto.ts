import {  IsNotEmpty, IsIn } from "class-validator";
import { ComputingUserType } from "../../computings/computing.enum";

export class CreateComputingRequestDto {
    @IsIn([ComputingUserType.TEACHER, ComputingUserType.POSTGRADUATE, ComputingUserType.OTHER])
    userType: string;

    @IsNotEmpty({message: "Số lõi không được để trống"})
    maxCpu: number;

    @IsNotEmpty({message: "Số RAM tối đa không được để trống"})
    maxRam: number;

    @IsNotEmpty({message: "Hạn sử dụng không được để trống"})
    endDate: Date;
}