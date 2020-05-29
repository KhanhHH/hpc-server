import { IsEmail, MinLength } from "class-validator";

export class LoginAccountDto {
    @IsEmail({},{ message: 'Email không hợp lệ' })
    email: string;

    @MinLength(6, { message: 'Mật khẩu không hợp lệ' })
    password: string;
}