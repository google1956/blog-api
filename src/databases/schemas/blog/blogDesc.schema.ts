import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type BlogDetailsDocument = HydratedDocument<BlogDetails>;

//With this option the createdAt and updatedAt properties will be added to the documents of the collection
@Schema({
    timestamps: true,
})
export class BlogDetails {
    _id?: ObjectId

    @Prop()
    blog_id: string

    @Prop()
    about: {
        type: string | "text" | "video" | "image",
        data: string,
    }[]
}

export const BlogDetailsSchema = SchemaFactory.createForClass(BlogDetails);