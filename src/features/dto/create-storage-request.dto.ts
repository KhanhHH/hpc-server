import {  IsNotEmpty, Min } from "class-validator";

export class CreateStorageRequestDto {
    @Min(1, { message: "Dung lượng không hợp lệ"})
    @IsNotEmpty({message: "Dung lượng không được để trống"})
    maxSize: number;

    @IsNotEmpty({message: "Hạn sử dụng không được để trống"})
    endDate: Date;
}