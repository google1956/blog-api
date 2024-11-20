import { Global, Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_ACCOUNT } from 'src/databases/db-constant';
import { AccountSchema } from 'src/databases/schemas/accounts/account.schema';
import { AccountDocumentService } from 'src/databases/documentations/accounts/account.document';
@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: COLLECTION_ACCOUNT,
                schema: AccountSchema
            },
        ])
    ],
    controllers: [AccountController],
    providers: [
        AuthService,
        AccountDocumentService
    ],
    exports: [
        AuthService,
    ]
})
export class AuthModule { }