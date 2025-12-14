import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ message: string }> {
    if (!signupDto.login || !signupDto.password) {
      throw new BadRequestException('Login and password are required');
    }

    if (
      typeof signupDto.login !== 'string' ||
      typeof signupDto.password !== 'string'
    ) {
      throw new BadRequestException('Login and password must be strings');
    }

    const existingUser = await this.userRepository.findOne({
      where: { login: signupDto.login },
    });

    if (existingUser) {
      throw new BadRequestException('User with this login already exists');
    }

    const hashedPassword = await bcrypt.hash(
      signupDto.password,
      Number(this.configService.get('CRYPT_SALT')),
    );
    const now = Date.now();

    const newUser = this.userRepository.create({
      login: signupDto.login,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    await this.userRepository.save(newUser);

    return { message: 'User created successfully' };
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    if (!loginDto.login || !loginDto.password) {
      throw new BadRequestException('Login and password are required');
    }

    if (
      typeof loginDto.login !== 'string' ||
      typeof loginDto.password !== 'string'
    ) {
      throw new BadRequestException('Login and password must be strings');
    }

    const user = await this.userRepository.findOne({
      where: { login: loginDto.login },
    });

    if (!user) {
      throw new ForbiddenException('Authentication failed');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Authentication failed');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshDto: RefreshDto): Promise<TokenResponseDto> {
    if (!refreshDto.refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    if (typeof refreshDto.refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token must be a string');
    }

    try {
      const payload = this.jwtService.verify(refreshDto.refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error: unknown) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }

  private generateAccessToken(user: User): string {
    const payload = { userId: user.id, login: user.login };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
      expiresIn: this.configService.get('TOKEN_EXPIRE_TIME'),
    });
  }

  private generateRefreshToken(user: User): string {
    const payload = { userId: user.id, login: user.login };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
      expiresIn: this.configService.get('TOKEN_REFRESH_EXPIRE_TIME'),
    });
  }
}
