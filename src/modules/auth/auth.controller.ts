import { Controller, UseGuards, Request, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './shared/local/local-auth.guard';

@ApiTags('Authenticate')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async authenticate(@Request() req: any) {
    return this.authService.authenticate(req.user);
  }
}
