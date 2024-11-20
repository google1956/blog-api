export interface IAuthorizedRequest extends Request {
    tokenInfo?: {
        expire: number,
        permission: any,
        account_id: string,
    };
}
