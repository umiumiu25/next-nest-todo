import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async getTasks(userId: number): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async getTaskById(taskId: number, userId: number): Promise<Task> {
    return await this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });
  }
  async createTask(dto: CreateTaskDto, userId: number): Promise<Task> {
    return await this.prisma.task.create({
      data: {
        ...dto,
        userId,
      },
    });
  }
  async updateTaskById(
    taskId: number,
    dto: UpdateTaskDto,
    userId: number,
  ): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task || task.userId !== userId)
      throw new ForbiddenException('You are not allowed to update this task');

    return await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...dto,
      },
    });
  }
  async deleteTaskById(taskId: number, userId: number): Promise<void> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task || task.userId !== userId)
      throw new ForbiddenException('You are not allowed to delete this task');

    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}
