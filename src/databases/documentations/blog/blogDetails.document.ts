import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { COLLECTION_BLOG_DETAILS } from "src/databases/db-constant";
import { BlogDetails } from "src/databases/schemas/blog/blogDesc.schema";

@Injectable()
export class BlogDetailsDocumentService {
    constructor(
        @InjectModel(COLLECTION_BLOG_DETAILS) private blogDetailsCollection: Model<BlogDetails>
    ) { }

    getById(_id: string): Promise<BlogDetails | null> {
        return this.blogDetailsCollection.findOne({ _id })
    }

    getByBlogId(blog_id: string): Promise<BlogDetails | null> {
        return this.blogDetailsCollection.findOne({ blog_id })
    }

    create(payload: any): Promise<BlogDetails> {
        return this.blogDetailsCollection.create(payload)
    }

    update(_id: string, payload: any): Promise<BlogDetails> {
        return this.blogDetailsCollection.findOneAndUpdate({ _id }, payload, { returnOriginal: false })
    }

    updateByBlogId(blog_id: string, payload: any): Promise<BlogDetails> {
        return this.blogDetailsCollection.findOneAndUpdate({ blog_id }, payload, { returnOriginal: false })
    }

    delete(_id: string) {
    }
}