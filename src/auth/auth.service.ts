import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { username, password } = signUpDto;

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.usersRepository.create({
        username,
        password: hashedPassword,
      });

      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists.');
      }

      throw new InternalServerErrorException('Unable to create user.');
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { username, password } = signInDto;

    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException(
        'User not found. Please check your login credentials',
      );
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    }

    throw new UnauthorizedException('Please check your login credentials');
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    userId: string,
  ): Promise<void> {
    const { password, newPassword, confirmNewPassword } = updatePasswordDto;

    // Retrieve the user by their ID
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    // Verify the user's current password
    const currentPasswordValid = await bcrypt.compare(password, user.password);

    if (!currentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect.');
    }

    // Check if the new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      throw new ConflictException(
        'New password and confirm password do not match.',
      );
    }

    // Hash the new password and update it
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Unable to update password.');
    }
  }
}
