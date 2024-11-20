import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { COLLECTION_ACCOUNT } from "../../db-constant";
import mongoose, { Model } from "mongoose";
import { Account } from "src/databases/schemas/accounts/account.schema";

@Injectable()
export class AccountDocumentService {
    constructor(@InjectModel(COLLECTION_ACCOUNT) private collectionAccount: Model<Account>) { }

    async get(account_id: string, password?: boolean) {
        let projection: any = {
            phone: 1,
            email: 1,
            emailValidateAt: 1,
            createdAt: 1
        }
        if (password) projection.password = 1
        return await this.collectionAccount.findOne({ _id: new mongoose.Types.ObjectId(account_id) }, projection)
    }

    findByUsername(username: string): Promise<Account> {
        return this.collectionAccount.findOne({ username: username })
    }

    findByEmail(email: string): Promise<Account> {
        return this.collectionAccount.findOne({ email: email })
    }


    async updatePassword(_id: string, hash: string) {
        return await this.collectionAccount.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(_id) }, { password: hash });
    }

    updateEmail(_id: string, email: string) {
        return this.collectionAccount.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(_id) }, { email: email })
    }

    checkAccountByEmailValidateToken(_id: string) {
        return this.collectionAccount.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(_id) }, { emailValidateAt: new Date() })
    }

    createNewAccount(account: any) {
        let payload = {
            username: account.username,
            email: account.email,
            password: account.password,
            last_name: account.last_name,
            first_name: account.first_name,
            full_name: account.last_name + ' ' + account.first_name,
        }
        return this.collectionAccount.create(payload)

    }

    getAccountByRestTokenId(token: string) {
        return this.collectionAccount.findOne({ resetPasswordToken: token })
    }

    updatePasswordTokenByEmail(email: string, token: string) {
        let requestResetPasswordAt: Date = new Date()
        return this.collectionAccount.findOneAndUpdate({ email }, { resetPasswordToken: token, requestResetPasswordAt })
    }

    resetPasswordByEmail(email: string, hash: string) {
        return this.collectionAccount.findOneAndUpdate({ email }, { resetPasswordToken: null, password: hash })
    }

}
