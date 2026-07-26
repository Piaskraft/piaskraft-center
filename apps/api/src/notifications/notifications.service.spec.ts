import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const findManyMock = jest.fn();
  const updateManyMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: PrismaService,
          useValue: {
            notification: {
              findMany: findManyMock,
              updateMany: updateManyMock,
            },
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('marks one notification as read for its recipient', async () => {
    updateManyMock.mockResolvedValue({ count: 1 });

    await expect(service.markAsRead(7, 'OPERATOR')).resolves.toEqual({
      success: true,
    });

    expect(updateManyMock).toHaveBeenCalledWith({
      where: {
        id: 7,
        recipient: 'OPERATOR',
      },
      data: {
        isRead: true,
      },
    });
  });
});
