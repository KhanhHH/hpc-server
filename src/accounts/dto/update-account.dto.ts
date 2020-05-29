
import { IsNotEmpty, MinLength, IsMobilePhone, IsIn, IsOptional } from 'class-validator';
import { AccountStatus, AccountType } from '../account.enum'

export class UpdateAccountDto {
    @IsOptional()
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 kí tự' })
    password: string;

    @IsNotEmpty()
    name: string;

    @IsMobilePhone("vi-VN", {}, { message: 'Số điện thoại không hợp lệ' })
    @IsNotEmpty()
    phone: string;

    @IsNotEmpty({ message: 'Đơn vị công tác không được để trống' })
    workplace: string;

    @IsIn([AccountType.ADMIN, AccountType.MEMBER], { message: 'Loại tài khoản không hợp lệ' })
    type: string;

    @IsIn([AccountStatus.ACTIVE, AccountStatus.DEACTIVE], { message: 'Trạng thái tài khoản không hợp lệ' })
    status: string;
}