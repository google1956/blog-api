import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AccountDocumentService } from "src/databases/documentations/accounts/account.document";
import { AccountLoginDto, AccountRegisterDto } from "src/dtos/accounts/account.dto";
import { AuthService } from "../services/auth.service";
import * as bcrypt from 'bcrypt';
import { saltOrRounds } from "src/databases/hash-constant";

@Controller('auth')
@ApiTags('auth')
export class AccountController {
    constructor(
        private readonly accountDocument: AccountDocumentService,
        private readonly authService: AuthService,

    ) { }

    @Post('/register')
    async register(
        @Body() accountRequest: AccountRegisterDto,
        @Res() res: Response,
    ) {
        let emailAndPhone = await this.authService.checkUsernameAndEmail(accountRequest.username, accountRequest.password)
        if (emailAndPhone.username != null) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: `${accountRequest.username} is existing!`
            })
        }

        if (emailAndPhone.email != null) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: `${accountRequest.email} is existing!`
            })
        }
        const passwordBefore = accountRequest.password
        accountRequest.password = await bcrypt.hash(passwordBefore, saltOrRounds)

        const newAccount = await this.accountDocument.createNewAccount(accountRequest)
        const dataSign = await this.authService.signJWT(newAccount.username, passwordBefore)

        if (dataSign) {
            return res.status(HttpStatus.CREATED).json({
                message: `Account was created`,
                data: {
                    account: {
                        _id: newAccount._id,
                        username: newAccount.username,
                        email: newAccount.email,
                    },
                    access_token: dataSign.access_token
                }
            })
        }
    }

    @Post('/login')
    public async login(
        @Body() accountRequest: AccountLoginDto,
        @Res() res: Response
    ) {
        let dataSign = await this.authService.signJWT(accountRequest.username, accountRequest.password)
        let account = dataSign.account
        return res.status(HttpStatus.OK).json({
            data: {
                account: {
                    _id: account._id,
                    email: account.email,
                    username: account.username
                },
                access_token: dataSign.access_token
            }
        })
    }
}