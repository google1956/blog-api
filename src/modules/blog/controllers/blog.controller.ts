import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Post, Put, Query, Req, Res, UnauthorizedException } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { IAuthorizedRequest } from "src/commons/authorizedRequest.interface";
import { Authorization } from "src/guards/authorization.guard";
import { BlogService } from "../services/blog.service";
import { CreateBlogDto, UpdateBlogDto, UpdateBlogStatusDto } from "src/dtos/blog/blog.dto";
import { AuthService } from "src/modules/auth/services/auth.service";
import { BLOG_ACCESS } from "src/databases/schemas/blog/blog.schema";
import { Request } from "express";
import { Pagination } from "src/dtos/commons.dto";

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
    constructor(
        private readonly blogService: BlogService,
        private readonly authService: AuthService,
    ) { }

    @Get('view')
    async getBlogsView(
        @Query() query: Pagination,
        @Req() request: Request,
        @Res() response: Response
    ) {
        let payload = {
            page: 1,
            limit: 10
        }
        const { page, limit } = query

        if (page && Number(page) > 0) {
            payload.page = Number(page) - 1
        }
        if (limit && Number(limit) > 0) {
            payload.limit = Number(limit)
        }

        const result = await this.blogService.getBlogList(payload)

        return response.status(HttpStatus.OK).json({
            data: result
        })
    }

    @Get('list')
    @ApiBearerAuth()
    @Authorization(true)
    async getBlogList(
        @Query() query: Pagination,
        @Req() request: IAuthorizedRequest,
        @Res() response: Response
    ) {
        const account_id = request.tokenInfo.account_id

        let payload = {
            page: 1,
            limit: 10
        }
        const { page, limit } = query

        if (page && Number(page) > 0) {
            payload.page = Number(page)
        }
        if (limit && Number(limit) > 0) {
            payload.limit = Number(limit)
        }
        const result = await this.blogService.getBlogList(payload, account_id)

        return response.status(HttpStatus.OK).json({
            data: result
        })
    }

    @Get('/:slug')
    async show(
        @Param('slug') slug: string,
        @Req() request: Request,
        @Res() response: Response

    ) {
        const { blog, blogDetails } = await this.blogService.getBlogBySlug(slug)

        if (!blog) {
            throw new NotFoundException();
        }

        let isCheck = true
        if (blog.access === BLOG_ACCESS.PRIVATE) {
            isCheck = false
            const account_id = await this.authService.authCheck(request)
            if (blog.created_by === account_id) isCheck = true
        }

        if (!isCheck) {
            throw new UnauthorizedException();
        }

        return response.status(HttpStatus.OK).json({
            data: {
                blog: {
                    title: blog.title,
                    slug: blog.slug,
                    description: blog.description,
                    thumbnail_url: blog.thumbnail_url,
                    type: blog.type,
                    category: blog.category,
                    tags: blog.tags,
                    status: blog.status,
                    access: blog.access,
                },
                blog_details: {
                    about: blogDetails.about
                }
            }
        });
    }

    @Get('id/:blog_id')
    @ApiBearerAuth()
    @Authorization(true)
    async getBlog(
        @Param('blog_id') _id: string,
        @Req() request: IAuthorizedRequest,
        @Res() response: Response
    ) {
        const account_id = request.tokenInfo.account_id

        const data = await this.blogService.getBlogById(_id, account_id)
        if (!data) throw new NotFoundException();

        const { blog } = data
        return response.status(HttpStatus.OK).json({
            data: { blog }
        })
    }



    @Post('create')
    @ApiBearerAuth()
    @Authorization(true)
    async createBlog(
        @Body() dto: CreateBlogDto,
        @Req() request: IAuthorizedRequest,
        @Res() response: Response
    ) {
        const account_id = request.tokenInfo.account_id

        const blogCreated = await this.blogService.createBlog({ ...dto, account_id })
        if (!blogCreated) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: 'An error occurred while creating the blog',
            })
        }

        return response.status(HttpStatus.OK).json({
            data: {
                blog: {
                    _id: blogCreated._id,
                    title: blogCreated.title,
                    slug: blogCreated.slug,
                    description: blogCreated.description,
                    thumbnail_url: blogCreated.thumbnail_url,
                    type: blogCreated.type,
                    category: blogCreated.category,
                    tags: blogCreated.tags,
                    status: blogCreated.status,
                    access: blogCreated.access,
                }
            }
        })
    }

    @Put('update/:blog_id')
    @ApiBearerAuth()
    @Authorization(true)
    async updateBlog(
        @Param('blog_id') _id: string,
        @Body() dto: UpdateBlogDto,
        @Req() request: IAuthorizedRequest,
        @Res() response: Response
    ) {
        if (!_id) throw new NotFoundException();

        const account_id = request.tokenInfo.account_id
        const blogUpdated = await this.blogService.updateBlog(_id,
            { account_id, ...dto }
        )

        if (!blogUpdated) throw new NotFoundException();
        return response.status(HttpStatus.OK).json({
            data: {
                blog: {
                    _id: blogUpdated._id,
                    title: blogUpdated.title,
                    slug: blogUpdated.slug,
                    description: blogUpdated.description,
                    thumbnail_url: blogUpdated.thumbnail_url,
                    type: blogUpdated.type,
                    category: blogUpdated.category,
                    tags: blogUpdated.tags,
                    status: blogUpdated.status,
                    access: blogUpdated.access,
                }
            }
        })
    }

    @Put('status/:blog_id')
    @ApiBearerAuth()
    @Authorization(true)
    async updateBlogStatus(
        @Param('blog_id') _id: string,
        @Body() dto: UpdateBlogStatusDto,
        @Req() request: IAuthorizedRequest,
        @Res() response: Response
    ) {
        if (!_id) throw new NotFoundException();

        const account_id = request.tokenInfo.account_id
        const blogUpdated = await this.blogService.updateBlog(_id,
            { account_id, ...dto }
        )

        if (!blogUpdated) throw new NotFoundException();

        return response.status(HttpStatus.OK).json({
            data: {
                blog: {
                    _id: blogUpdated._id,
                    title: blogUpdated.title,
                    slug: blogUpdated.slug,
                    description: blogUpdated.description,
                    thumbnail_url: blogUpdated.thumbnail_url,
                    type: blogUpdated.type,
                    category: blogUpdated.category,
                    tags: blogUpdated.tags,
                    status: blogUpdated.status,
                    access: blogUpdated.access,
                }
            }
        })
    }

}