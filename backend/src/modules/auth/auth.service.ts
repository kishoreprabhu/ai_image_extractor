export class AuthService {
    getUserId(request:any):string {
        const user = request.user;
        const userId = user.userId;
        return userId
    }
}