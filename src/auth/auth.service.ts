import { Injectable } from '@nestjs/common';

import { SignUpDto, SignInDto } from './dto';

@Injectable()
export class AuthService {
  signUp(signUpDto: SignUpDto) {
    // TODO: implementar registro de usuario
    throw new Error('Method not implemented.');
  }

  signIn(signInDto: SignInDto) {
    // TODO: implementar login
    throw new Error('Method not implemented.');
  }

  verify(data: any) {
    // TODO: implementar verificacion de token JWT
    throw new Error('Method not implemented.');
  }
}
