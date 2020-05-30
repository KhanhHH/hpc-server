import { IsIn, IsNotEmpty } from "class-validator";
import { FeatureRequestStatus } from "../feature-request-status.enum";

export class UpdateFeatureRequestStatusDto {
    @IsIn([FeatureRequestStatus.APPROVED, FeatureRequestStatus.REJECTED])
    status: string
}