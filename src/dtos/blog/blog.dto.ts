import { Optional } from "@nestjs/common";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, MinLength } from "class-validator";



export class CreateBlogDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    thumbnail_url: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    type: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    category: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    tags: string[]
}

export class UpdateBlogDto extends PartialType(CreateBlogDto) { }

export class UpdateBlogStatusDto {
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    status: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    access: number;
}

export class UpdateBlogDetailsDto {
    @ApiProperty()
    @IsArray()
    @IsOptional()
    about: [{
        type: string,
        data: string,
    }]
}