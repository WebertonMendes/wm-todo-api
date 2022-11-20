import * as path from 'path';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';
import { deleteFile } from 'src/utils/upload.utils';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async create(createTaskData: CreateTaskDto, tokenString: string) {
    const token = tokenString.replace('Bearer ', '');
    const user = this.jwtService.decode(token);
    const userId = user.sub;

    await this.usersService.findOne(userId);

    const newTaskData = {
      description: createTaskData.description,
      user_id: userId,
    };

    try {
      const newTask = this.taskRepository.create(newTaskData);
      const savedTask = await this.taskRepository.save(newTask);

      return {
        id: savedTask.id,
        description: savedTask.description,
        user_id: savedTask.user_id,
        created_at: savedTask.created_at,
        updated_at: savedTask.updated_at,
      };
    } catch (error) {
      throw new HttpException(
        `Error saving task. Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(finished?: boolean, tokenString?: string) {
    const token = tokenString.replace('Bearer ', '');
    const user = this.jwtService.decode(token);
    const userId = user.sub;

    if (finished) {
      return await this.taskRepository.find({
        where: {
          is_finished: finished,
          user_id: userId,
        },
      });
    } else {
      return await this.taskRepository.find({
        where: {
          user_id: userId,
        },
        order: {
          is_finished: 'ASC',
          created_at: 'DESC',
        },
      });
    }
  }

  async findOne(id: string, tokenString: string) {
    const token = tokenString.replace('Bearer ', '');
    const user = this.jwtService.decode(token);
    const userId = user.sub;

    const task = await this.taskRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!task) throw new HttpException(`Task not found!`, HttpStatus.ACCEPTED);

    return task;
  }

  async update(id: string, updateTaskData: UpdateTaskDto, tokenString: string) {
    const token = tokenString.replace('Bearer ', '');
    const user = this.jwtService.decode(token);
    const userId = user.sub;

    const task = await this.taskRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!task) throw new HttpException(`Task not found!`, HttpStatus.ACCEPTED);

    try {
      await this.taskRepository.update(id, updateTaskData);
    } catch (error) {
      throw new HttpException(
        `Error updating task. Error: '${error.message}'.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string, tokenString: string) {
    const token = tokenString.replace('Bearer ', '');
    const user = this.jwtService.decode(token);
    const userId = user.sub;

    const task = await this.taskRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!task) throw new HttpException(`Task not found!`, HttpStatus.ACCEPTED);

    try {
      await this.taskRepository.delete(id);

      if (task.attachment) {
        const dirStorage = path.resolve('.', 'src/storage');
        const filename = `${dirStorage}/${task.id}.pdf`
        await deleteFile(filename);
      }
    } catch (error) {
      throw new HttpException(
        `Error removing task. Error: '${error.message}'.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
