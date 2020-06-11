import {  IsNotEmpty } from "class-validator";

export class CreateComputingQueueDto {
    @IsNotEmpty({message: "Script thực thi không được để trống"})
    script: string;

    @IsNotEmpty({message: "Số CPU không được để trống"})
    cpu: number;

    @IsNotEmpty({message: "Số RAM tối đa không được để trống"})
    maxRamPerProcess: number;
}