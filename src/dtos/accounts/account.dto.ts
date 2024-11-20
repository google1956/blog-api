import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AccountLoginDto {
    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string
}

export class AccountRegisterDto {
    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    last_name: string;

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @ApiProperty()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string
}