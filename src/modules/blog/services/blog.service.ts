import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { BlogDocumentService } from "src/databases/documentations/blog/blog.document";
import { Blog, BLOG_ACCESS, BLOG_STATUS } from "src/databases/schemas/blog/blog.schema";
import slugify from 'slugify';
import { BlogDetailsDocumentService } from "src/databases/documentations/blog/blogDetails.document";
import { BlogDetails } from "src/databases/schemas/blog/blogDesc.schema";

@Injectable()
export class BlogService {
    constructor(
        private readonly blogDocument: BlogDocumentService,
        private readonly blogDetailsDocument: BlogDetailsDocumentService,
    ) { }

    async getBlogList(payload: { page: number, limit: number }, account_id?: string) {
        let result: any
        if (account_id) {
            result = await this.blogDocument.getOwnerList(account_id, payload);
        } else {
            result = await this.blogDocument.getViewList_v1(payload);
        }
        return result
    }

    async getBlogBySlug(slug: string) {
        const blog = await this.blogDocument.getBySlug(slug);
        if (!blog) throw new NotFoundException();
        const blogDetails = await this.blogDetailsDocument.getByBlogId(blog._id)

        return {
            blog: blog,
            blogDetails: blogDetails,
        }
    }

    async getBlogById(_id: string, account_id: string) {
        const blog = await this.blogDocument.getById(_id, account_id)
        if (blog) {
            const blogDetails = await this.blogDetailsDocument.getByBlogId(blog._id)
            return {
                blog: blog,
                blogDetails: blogDetails,
            }
        }
        return null
    }

    async createBlog(payload: any) {
        const { title, thumbnail_url, type, category, description, tags, account_id } = payload
        const slug = await this.generateSlug(title)

        let newBlog: Blog = {
            title: title,
            slug: slug,
            description: description || '',
            thumbnail_url: thumbnail_url || '',
            type: type || '',
            category: category || '',
            tags: tags || [],
            status: BLOG_STATUS.DRAFT,
            access: BLOG_ACCESS.PRIVATE,
            public_date: null,
            created_by: account_id,
            deleted_at: null,
        }
        try {
            newBlog = await this.blogDocument.create(newBlog)
            await this.createBlogDetails(newBlog._id.toString())
            return newBlog
        } catch (err) {
            return null
        }

    }

    async updateBlog(_id: string, payload: any) {
        const blogUpdated = await this.blogDocument.update(_id, payload)
        if (!blogUpdated) return null
        return blogUpdated
    }

    async updateBlogDetails(blog_id: string, payload: any) {
        const blog = await this.blogDocument.getById(blog_id, payload.account_id)
        if (blog) {
            delete payload.account_id
            const blogDetailsUpdated = await this.blogDetailsDocument.updateByBlogId(blog_id, payload)
            if (!blogDetailsUpdated) return null
            return blogDetailsUpdated
        }
        return null
    }

    private async generateSlug(title: string) {
        if (!title) return

        let uniqueSlug: string
        let isUnique = false;

        while (!isUnique) {
            const uniqueId = Math.floor(100000 + Math.random() * 900000).toString();
            const slug = slugify(title, { lower: true });
            uniqueSlug = `${slug}-${uniqueId}`;

            // Check if the slug already exists
            const existingBlog = await this.blogDocument.getBySlug(uniqueSlug, true);
            if (!existingBlog) {
                isUnique = true;
            }
        }
        return uniqueSlug
    }

    private async createBlogDetails(blog_id: string) {
        let newBlogDesc: BlogDetails = {
            blog_id: blog_id,
            about: [],
        }
        try {
            newBlogDesc = await this.blogDetailsDocument.create(newBlogDesc)
            return newBlogDesc
        } catch (err) {
            return null
        }
    }
}