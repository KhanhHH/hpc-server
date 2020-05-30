import { MinDate, IsNotEmpty, Min } from "class-validator";

export class CreateStorageRequestDto {
    @Min(1, { message: "Dung lượng không hợp lệ"})
    @IsNotEmpty({message: "Dung lượng không được để trống"})
    maxSize: number;

    // @MinDate(new Date(), {message: "Ngày sử dụng không hợp lệ"})
    @IsNotEmpty({message: "Ngày sử dụng không được để trống"})
    endDate: Date;
}