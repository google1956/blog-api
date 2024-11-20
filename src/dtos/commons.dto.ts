import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class Pagination {
    @ApiProperty({ default: 1 })
    @IsString()
    @IsOptional()
    page: string

    @ApiProperty({ default: 10 })
    @IsString()
    @IsOptional()
    limit: string
}
