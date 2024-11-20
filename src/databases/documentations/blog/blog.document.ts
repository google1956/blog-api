import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { COLLECTION_BLOG, COLLECTION_BLOG_DETAILS } from "src/databases/db-constant";
import { Blog, BLOG_ACCESS, BLOG_STATUS } from "src/databases/schemas/blog/blog.schema";
import { addLookup } from "../commons.document";

@Injectable()
export class BlogDocumentService {
    constructor(
        @InjectModel(COLLECTION_BLOG) private blogCollection: Model<Blog>
    ) { }
    async getViewList_v1(payload: { page: number, limit: number }) {
        const { page, limit } = payload
        const skip = (page - 1) * limit;

        // Query to filter blogs where `deleted_at` is null or undefined
        const query = {
            status: BLOG_STATUS.PUBLIC,
            access: BLOG_ACCESS.PUBLIC,
            $or: [
                { deleted_at: { $eq: null } },
                { deleted_at: { $exists: false } }
            ]
        };
        // Fetch the blogs
        const blogs = await this.blogCollection
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }) // Sort by newest blogs first
            .lean();

        // console.log('blogs', blogs)
        // Count total blogs that match the query
        const total = await this.blogCollection.countDocuments(query);
        return { blogs: blogs, total };
    }

    async getViewList_v2(payload: { page: number, limit: number }) {
        const { page, limit } = payload
        console.log(page, limit)
        let result = await this.blogCollection.aggregate([
            {
                $match: {
                    status: BLOG_STATUS.PUBLIC,
                    access: BLOG_ACCESS.PUBLIC,
                    $or: [
                        { deleted_at: { $eq: null } },
                        { deleted_at: { $exists: false } }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'blog_details',
                    let: { blogId: { $toString: '$_id' } }, // Convert `_id` to string
                    pipeline: [
                        { $match: { $expr: { $eq: ['$blog_id', '$$blogId'] } } },
                        {
                            $project: {
                                _id: 0,
                                about: 1
                            },
                        },
                    ],
                    as: 'details',

                },
            },
            {
                $facet: {
                    blogs: [
                        {
                            $sort: { createdAt: -1 }
                        },
                        {
                            $skip: (page - 1) * limit
                        },
                        {
                            $limit: limit
                        },

                        {
                            $project: {
                                _id: 0,
                                title: 1,
                                slug: 1,
                                description: 1,
                                thumbnail_url: 1,
                                type: 1,
                                category: 1,
                                tags: 1,
                                status: 1,
                                access: 1,
                                details: { $arrayElemAt: ['$details', 0] },
                            },
                        },
                    ],
                    total: [{
                        $count: 'total'
                    }]
                }
            },
            {
                $addFields: {
                    total: {
                        $ifNull: [{ $arrayElemAt: ["$total.total", 0] }, 0]
                    }
                }
            }
        ])

        return result
    }



    async getOwnerList(account_id: string, payload: { page: number, limit: number }) {
        const { page, limit } = payload
        const skip = (page - 1) * limit;

        // Query to filter blogs where `deleted_at` is null or undefined
        const query = {
            created_by: account_id,
            $or: [
                { deleted_at: { $eq: null } },
                { deleted_at: { $exists: false } }
            ]
        };
        console.log('query', query)
        // Fetch the blogs
        const blogs = await this.blogCollection
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }) // Sort by newest blogs first
            .lean();

        // console.log('blogs', blogs)
        // Count total blogs that match the query
        const total = await this.blogCollection.countDocuments(query);
        return { blogs: blogs, total };
    }

    async getById(_id: string, account_id?: string): Promise<Blog | null> {
        if (account_id) {
            return this.blogCollection.findOne({
                _id, created_by: account_id, $or: [
                    { deleted_at: { $eq: null } },
                    { deleted_at: { $exists: false } }
                ]
            })
        } else {
            return this.blogCollection.findOne({
                _id, $or: [
                    { deleted_at: { $eq: null } },
                    { deleted_at: { $exists: false } }
                ]
            })
        }

    }

    async getBySlug(slug: string, isCheckAll: boolean = false): Promise<Blog> {
        if (isCheckAll) {
            return this.blogCollection.findOne({ slug })
        } else {
            return this.blogCollection.findOne({
                slug, $or: [
                    { deleted_at: { $eq: null } },
                    { deleted_at: { $exists: false } }
                ]
            })
        }
    }

    async getBySlugs(slug: string): Promise<Blog | null> {
        return this.blogCollection.findOne({ slug: { $regex: slug, $options: "i" }, })
    }

    create(payload: any): Promise<Blog> {
        return this.blogCollection.create(payload)
    }

    update(_id: string, payload: any): Promise<Blog> {
        const { account_id, status } = payload
        delete payload.account_id

        if (status === BLOG_STATUS.PUBLIC) {
            payload.public_date = new Date()
        }

        if (account_id) {
            return this.blogCollection.findOneAndUpdate({ _id, created_by: account_id }, payload, { returnOriginal: false })

        } else {
            return this.blogCollection.findOneAndUpdate({ _id }, payload, { returnOriginal: false })

        }
    }


    delete(_id: string) {
    }
}