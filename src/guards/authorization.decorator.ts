import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_KEY } from 'src/databases/jwt-constant';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private authService: AuthService
    ) { }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const secured = this.reflector.get<string[]>(AUTH_KEY, context.getHandler());

        if (!secured) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const account_id = this.authService.authCheck(request)
        request.tokenInfo = {
            account_id: account_id,
        };
        return true;
    }
}
