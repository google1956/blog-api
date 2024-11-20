import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_BLOG, COLLECTION_BLOG_DETAILS, } from 'src/databases/db-constant';
import { BlogSchema } from 'src/databases/schemas/blog/blog.schema';
import { BlogDetailsSchema } from 'src/databases/schemas/blog/blogDesc.schema';
import { BlogService } from './services/blog.service';
import { BlogDetailsDocumentService } from 'src/databases/documentations/blog/blogDetails.document';
import { BlogDocumentService } from 'src/databases/documentations/blog/blog.document';
import { BlogController } from './controllers/blog.controller';
import { BlogDetailsController } from './controllers/blogDetails.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: COLLECTION_BLOG,
                schema: BlogSchema
            },
            {
                name: COLLECTION_BLOG_DETAILS,
                schema: BlogDetailsSchema
            },
        ])
    ],
    controllers: [
        BlogController,
        BlogDetailsController,
    ],
    providers: [
        BlogService,
        BlogDocumentService,
        BlogDetailsDocumentService,
    ],
})
export class BlogModule { }