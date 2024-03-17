import { Injectable } from '@nestjs/common';

import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { PrismaService } from '../prima.service';
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await this.prismaService.notification.create({
      data,
    });
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prismaService.notification.findUnique({
      where: {
        id,
      },
    });

    if (!notification) {
      return null;
    }

    return PrismaNotificationMapper.toDomain(notification);
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await this.prismaService.notification.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
