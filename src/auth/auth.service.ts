import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import bcrypt from 'bcryptjs';

import { PrismaService } from '@src/common/services';

import { SignUpDto, SignInDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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
        messages: [
          error instanceof Error ? error.message : 'Error al registrar usuario',
        ],
      });
    }
  }

  async signIn(signInDto: SignInDto) {
    try {
      const { email, password } = signInDto;

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          messages: ['Credenciales inválidas'],
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          messages: ['Credenciales inválidas'],
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      const token = await this.jwtService.signAsync(userWithoutPassword);

      return { user: userWithoutPassword, token };
    } catch (error) {
      if (error instanceof RpcException) throw error;

      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        messages: [error instanceof Error ? error.message : 'Error al iniciar sesión'],
      });
    }
  }

  verify(data: any) {
    // TODO: implementar verificacion de token JWT
    throw new Error('Method not implemented.');
  }
}
