import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  const findAllMock = jest.fn();
  const markAsReadMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: {
            findAll: findAllMock,
            markAsRead: markAsReadMock,
          },
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('marks one notification as read', async () => {
    markAsReadMock.mockResolvedValue({
      success: true,
    });

    await expect(controller.markAsRead(7, 'OPERATOR')).resolves.toEqual({
      success: true,
    });

    expect(markAsReadMock).toHaveBeenCalledWith(7, 'OPERATOR');
  });
});
