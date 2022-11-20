import { hash } from 'bcrypt';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserData: CreateUserDto) {
    const userAlreadyExists = await this.usersRepository.findOne({
      where: {
        email: createUserData.email,
      },
    });

    if (userAlreadyExists)
      throw new HttpException(
        `This email already exists!`,
        HttpStatus.CONFLICT,
      );

    createUserData.password = await hash(createUserData.password, 8);

    try {
      const newUser = this.usersRepository.create(createUserData);
      const savedUser = await this.usersRepository.save(newUser);

      return {
        id: savedUser.id,
        email: savedUser.email,
        is_active: savedUser.is_active,
        created_at: savedUser.created_at,
        updated_at: savedUser.updated_at,
      };
    } catch (error) {
      throw new HttpException(
        `Error saving user. Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(active?: boolean) {
    if (active) {
      return await this.usersRepository.find({
        where: {
          is_active: active,
        },
      });
    } else {
      return await this.usersRepository.find();
    }
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) throw new HttpException(`User not found!`, HttpStatus.ACCEPTED);

    return user;
  }

  async findByEmail(email: string) {
    const queryBuilder = this.usersRepository.createQueryBuilder('u');

    return queryBuilder
      .select([
        'u.id',
        'u.email',
        'u.is_active',
        'u.created_at',
        'u.updated_at',
      ])
      .addSelect('u.password')
      .where({
        email: ILike(email),
        is_active: true,
      })
      .getOne();
  }

  async update(id: string, updateUserData: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) throw new HttpException(`User not found!`, HttpStatus.ACCEPTED);

    if (updateUserData.password)
      updateUserData.password = await hash(updateUserData.password, 8);

    try {
      await this.usersRepository.update(id, updateUserData);
    } catch (error) {
      throw new HttpException(
        `Error updating user. Error: '${error.message}'.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) throw new HttpException(`User not found!`, HttpStatus.ACCEPTED);

    try {
      await this.usersRepository.delete(id);
    } catch (error) {
      throw new HttpException(
        `Error removing user. Error: '${error.message}'.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
