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

  const createMock =
    jest.fn<(options: unknown) => Promise<Record<string, unknown>>>();

  const findUniqueMock = jest.fn<
    (options: unknown) => Promise<{
      id: number;
      status: string;
      archivedAt: Date | null;
    } | null>
  >();

  const updateMock =
    jest.fn<(options: unknown) => Promise<Record<string, unknown>>>();

  const deleteManyMock =
    jest.fn<(options: unknown) => Promise<{ count: number }>>();

  const prismaMock = {
    task: {
      findMany: findManyMock,
      create: createMock,
      findUnique: findUniqueMock,
      update: updateMock,
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

  it('creates a notification when a task is assigned to the other user', async () => {
    const createdTask = {
      id: 1,
      title: 'Sprawdź produkt',
    };

    createMock.mockResolvedValue(createdTask);

    await expect(
      service.create({
        title: 'Sprawdź produkt',
        description: 'Opis zadania',
        assignedTo: 'OPERATOR',
        category: 'PIASKRAFT',
        createdBy: 'ADMIN',
      }),
    ).resolves.toEqual(createdTask);

    expect(createMock).toHaveBeenCalledWith({
      data: {
        title: 'Sprawdź produkt',
        description: 'Opis zadania',
        assignedTo: 'OPERATOR',
        category: 'PIASKRAFT',
        date: null,
        time: null,
        createdBy: 'ADMIN',
        notifications: {
          create: {
            type: 'TASK_CREATED',
            recipient: 'OPERATOR',
            actor: 'ADMIN',
            title: 'Nowe zadanie',
            message: 'Przypisano Ci zadanie: Sprawdź produkt',
          },
        },
      },
      include: {
        comments: true,
      },
    });
  });

  it('archives a completed task', async () => {
    const archivedTask = {
      id: 1,
      archivedAt: new Date(),
    };

    findUniqueMock.mockResolvedValue({
      id: 1,
      status: 'DONE',
      archivedAt: null,
    });

    updateMock.mockResolvedValue(archivedTask);

    await expect(service.archive(1)).resolves.toEqual(archivedTask);

    expect(findUniqueMock).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });

    expect(updateMock).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        archivedAt: expect.any(Date),
      },
      include: {
        comments: true,
      },
    });
  });

  it('restores an archived task', async () => {
    const restoredTask = {
      id: 1,
      archivedAt: null,
    };

    findUniqueMock.mockResolvedValue({
      id: 1,
      status: 'DONE',
      archivedAt: new Date(),
    });

    updateMock.mockResolvedValue(restoredTask);

    await expect(service.restore(1)).resolves.toEqual(restoredTask);

    expect(findUniqueMock).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });

    expect(updateMock).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        archivedAt: null,
      },
      include: {
        comments: true,
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
