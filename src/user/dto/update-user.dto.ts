import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    id: number;

    name: string

    @IsEmail()
    email: string;

    @MinLength(6 , {message: 'Пароль должен быть больше 6 символов'})
    password: string;

}
