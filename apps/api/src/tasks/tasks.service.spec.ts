import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { PrismaService } from '../prisma/prisma.service';
import { TasksService } from './tasks.service';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('TasksService', () => {
  let service: TasksService;

  const findManyMock =
    jest.fn<(options: unknown) => Promise<Array<{ id: number }>>>();

  const deleteManyMock =
    jest.fn<(options: unknown) => Promise<{ count: number }>>();

  const prismaMock = {
    task: {
      findMany: findManyMock,
    },
    taskComment: {
      deleteMany: deleteManyMock,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new TasksService(prismaMock as unknown as PrismaService);
  });

  it('returns tasks with comments', async () => {
    findManyMock.mockResolvedValue([{ id: 1 }]);

    await expect(service.findAll()).resolves.toEqual([{ id: 1 }]);

    expect(findManyMock).toHaveBeenCalledWith({
      include: {
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('deletes a comment belonging to a task', async () => {
    deleteManyMock.mockResolvedValue({ count: 1 });

    await expect(service.deleteComment(2, 3)).resolves.toEqual({
      success: true,
    });

    expect(deleteManyMock).toHaveBeenCalledWith({
      where: {
        id: 3,
        taskId: 2,
      },
    });
  });

  it('rejects deletion of a missing comment', async () => {
    deleteManyMock.mockResolvedValue({ count: 0 });

    await expect(service.deleteComment(2, 999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
