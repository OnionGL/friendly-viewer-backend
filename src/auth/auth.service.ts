import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ){ }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);

    if(!user) {
      throw new UnauthorizedException()
    }

    const passwordIsMatch = await argon2.verify(user?.password , password)

    if (user && passwordIsMatch) {
      return user;
    }
    
    throw new UnauthorizedException()

  }

  async login(user: IUser) {

    const {id , email , name} = user

    return {
      id,
      email,
      token: this.jwtService.sign({id , email , name})
    };

  }

}
