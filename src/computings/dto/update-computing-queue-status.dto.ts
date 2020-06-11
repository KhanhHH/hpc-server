import { IsIn, } from "class-validator";
import { ComputingQueueStatus } from "../computing.enum";


export class UpdateComputingQueueStatusDto {
    @IsIn([ComputingQueueStatus.CANCELED, ComputingQueueStatus.COMPLETED])
    status: string
}