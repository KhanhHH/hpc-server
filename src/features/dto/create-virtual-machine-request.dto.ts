import { IsNotEmpty } from "class-validator";

export class CreateVirtualMachineRequestDto {
    @IsNotEmpty({message: "CPU không được để trống"})
    cpu: number;

    @IsNotEmpty({message: "RAM không được để trống"})
    ram: number;

    @IsNotEmpty({message: "HDD không được để trống"})
    hdd: number;

    @IsNotEmpty({message: "Hạn sử dụng không được để trống"})
    endDate: Date;
}