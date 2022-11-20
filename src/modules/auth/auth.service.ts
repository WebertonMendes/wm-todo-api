import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { UsersService } from '../users/users.service';

interface IPayload {
  id: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user)
      throw new UnauthorizedException('Failed, user or password incorrect.');

    const validatedPassword = await compare(password, user.password);

    if (!validatedPassword)
      throw new UnauthorizedException('Failed, user or password incorrect.');

    if (user && validatedPassword) {
      return {
        id: user.id,
        email: user.email,
      };
    } else {
      return null;
    }
  }

  async authenticate(user: IPayload) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}
