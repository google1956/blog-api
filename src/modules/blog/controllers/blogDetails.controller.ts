import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Post, Put, Req, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { IAuthorizedRequest } from "src/commons/authorizedRequest.interface";
import { Authorization } from "src/guards/authorization.guard";
import { BlogService } from "../services/blog.service";
import { UpdateBlogDetailsDto } from "src/dtos/blog/blog.dto";

@ApiTags('Blog')
@Controller('blog/details')
export class BlogDetailsController {
    constructor(
        private readonly blogService: BlogService,
    ) { }

    @Get('/id/:blog_id')
    @ApiBearerAuth()
    @Authorization(true)
    async getBlogDetails(
        @Param('blog_id') _id: string,
        @Req() request: IAuthorizedRequest,
        @Res() response: Response
    ) {
        const account_id = request.tokenInfo.account_id

        const data = await this.blogService.getBlogById(_id, account_id)
        if (!data) throw new NotFoundException();

        const { blogDetails } = data
        return response.status(HttpStatus.OK).json({
            data: { blog_details: blogDetails }
        })
    }

    @Put('/:blog_id')
    @ApiBearerAuth()
    @Authorization(true)
    async updateBlogDetails(
        @Param('blog_id') blog_id: string,
        @Body() dto: UpdateBlogDetailsDto,
        @Req() request: IAuthorizedRequest,
        @Res() response: Response
    ) {
        if (!blog_id) throw new NotFoundException();
        const account_id = request.tokenInfo.account_id
        const blogDetailsUpdated = await this.blogService.updateBlogDetails(blog_id,
            { account_id, ...dto }
        )

        if (!blogDetailsUpdated) throw new NotFoundException();
        return response.status(HttpStatus.OK).json({
            data: {
                blog_details: blogDetailsUpdated
            }
        })
    }

}