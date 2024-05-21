import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';
import { TodoService } from './todo.service';

@UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getTasks(@Req() req: Request): Promise<Task[]> {
    return await this.todoService.getTasks(req.user.id);
  }

  @Get(':id')
  async getTaskById(
    @Param('id', ParseIntPipe) taskId: number,
    @Req() req: Request,
  ): Promise<Task> {
    return await this.todoService.getTaskById(taskId, req.user.id);
  }

  @Post()
  async createTask(
    @Body() dto: CreateTaskDto,
    @Req() req: Request,
  ): Promise<Task> {
    return await this.todoService.createTask(dto, req.user.id);
  }

  @Patch(':id')
  async updateTaskById(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskDto,
    @Req() req: Request,
  ): Promise<Task> {
    return await this.todoService.updateTaskById(taskId, dto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTaskById(
    @Param('id', ParseIntPipe) taskId: number,
    @Req() req: Request,
  ): Promise<void> {
    return await this.todoService.deleteTaskById(taskId, req.user.id);
  }
}
