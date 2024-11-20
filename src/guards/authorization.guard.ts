import { SetMetadata } from '@nestjs/common';
import { AUTH_KEY } from 'src/databases/jwt-constant';

export const Authorization = (secured: boolean) =>
    SetMetadata(AUTH_KEY, secured);