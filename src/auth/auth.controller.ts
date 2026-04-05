import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.sign-up')
  signUp(@Payload() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @MessagePattern('auth.sign-in')
  signIn(@Payload() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @MessagePattern('auth.verify')
  verify(@Payload() data: any) {
    // TODO: implementar verificacion de token
    return this.authService.verify(data);
  }
}
