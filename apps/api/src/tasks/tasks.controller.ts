import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() data: CreateTaskDto) {
    return this.tasksService.create(data);
  }

  @Post(':taskId/comments')
  addComment(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() data: CreateTaskCommentDto,
  ) {
    return this.tasksService.addComment(taskId, data);
  }

  @Delete(':taskId/comments/:commentId')
  deleteComment(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('commentId', ParseIntPipe)
    commentId: number,
  ) {
    return this.tasksService.deleteComment(taskId, commentId);
  }

  @Patch(':taskId')
  update(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() data: UpdateTaskDto,
  ) {
    return this.tasksService.update(taskId, data);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }
}
