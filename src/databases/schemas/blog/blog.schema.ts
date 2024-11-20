import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument, ObjectId } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

//With this option the createdAt and updatedAt properties will be added to the documents of the collection
@Schema({
    timestamps: true,
})
export class Blog {

    _id?: string

    @Prop()
    title: string

    @Prop()
    slug: string;

    @Prop()
    description: string;

    @Prop()
    thumbnail_url: string

    @Prop()
    type: string

    @Prop()
    category: string

    @Prop()
    tags: string[]

    @Prop()
    status: BLOG_STATUS

    @Prop()
    access: BLOG_ACCESS

    @Prop({ type: Date })
    public_date: Date

    @Prop()
    created_by: string

    @Prop({ type: Date })
    deleted_at: Date
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

export enum BLOG_STATUS {
    DRAFT = 0,
    PUBLIC = 1,
}

export enum BLOG_ACCESS {
    PRIVATE = 0,
    PUBLIC = 1,
}