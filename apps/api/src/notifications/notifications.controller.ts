import { Controller, Get, ParseEnumPipe, Query } from '@nestjs/common';
import { TaskAuthor } from '../generated/prisma/enums';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(
    @Query('recipient', new ParseEnumPipe(TaskAuthor))
    recipient: TaskAuthor,
  ) {
    return this.notificationsService.findAll(recipient);
  }
}
