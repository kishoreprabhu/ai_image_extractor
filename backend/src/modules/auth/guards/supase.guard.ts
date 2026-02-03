import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SupabaseAuthGuard extends AuthGuard('supabase') {
    handleRequest(err, user, info) {
        if (err || !user) {
            console.log('Auth Error Details:', info?.message); 
            throw err || new UnauthorizedException();
        }
        return user;
    }
}