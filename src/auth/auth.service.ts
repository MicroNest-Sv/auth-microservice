import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '@src/common/services';

import { SignUpDto, SignInDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const { name, email, password } = signUpDto;

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new RpcException({
          status: HttpStatus.CONFLICT,
          messages: ['El email ya está registrado'],
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      if (error instanceof RpcException) throw error;

      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        messages: ['Error al registrar usuario'],
      });
    }
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
