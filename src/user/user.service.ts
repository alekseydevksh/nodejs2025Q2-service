import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Login or password are required');
    }

    const existingUser = await this.userRepository.findOne({
      where: { login: createUserDto.login },
    });

    if (existingUser) {
      throw new BadRequestException('User with this login already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const now = Date.now();

    const newUser = this.userRepository.create({
      login: createUserDto.login,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    const savedUser = await this.userRepository.save(newUser);

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    if (!updatePasswordDto.oldPassword || !updatePasswordDto.newPassword) {
      throw new BadRequestException(
        'Old password or new password are required',
      );
    }

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Old password is wrong');
    }

    user.password = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    user.updatedAt = Date.now();

    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
