import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccountDocumentService } from "src/databases/documentations/accounts/account.document";
import { Account } from "src/databases/schemas/accounts/account.schema";
import * as bcrypt from 'bcrypt';
import { Request } from "express";

@Injectable()
export class AuthService {
    constructor(
        private readonly accountDocumentService: AccountDocumentService,
        private jwtService: JwtService
    ) { }

    async checkUsernameAndEmail(username: string, email: string): Promise<{ username: string | null, email: string | null }> {
        let account: any = await this.accountDocumentService.findByUsername(username)
        if (account && account.username)
            return {
                username: account.username,
                email: null
            }


        account = await this.accountDocumentService.findByEmail(email)
        if (account && account.phone)
            return {
                username: null,
                email: account.email
            }

        return {
            username: null,
            email: null
        }
    }

    async signJWT(username: string, password: string) {
        const account: Account = await this.accountDocumentService.findByUsername(username)
        if (!account) throw new UnauthorizedException();
        const isMatch = await bcrypt.compare(password, account.password);

        if (!isMatch) throw new UnauthorizedException();

        const payload = {
            account_id: account._id,
            username: account.username,
            expired: new Date().getTime() + 48 * 60 * 60 * 1000
        };
        //subcription here
        return {
            access_token: await this.jwtService.signAsync(payload),
            account: account,
        };
    }

    decodeJWTToken(token: string) {
        const decodedJwtAccessToken: any = this.jwtService.decode(token);
        if (!decodedJwtAccessToken) return null

        const now = new Date().getTime() / 1000;
        if (decodedJwtAccessToken.expired <= now) return null

        return decodedJwtAccessToken
    }

    authCheck(request: any) {
        const authHeaders = request.headers.authorization;

        if (!authHeaders || !(authHeaders as string).split(' ')[1]) {
            throw new UnauthorizedException();
        }

        const token = (authHeaders as string).split(' ')[1];
        if (!token) {
            throw new UnauthorizedException();
        }

        const decodedJwtAccessToken = this.decodeJWTToken(token)
        if (!decodedJwtAccessToken) {
            throw new UnauthorizedException();
        }

        return decodedJwtAccessToken.account_id
    }
}