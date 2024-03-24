import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import {
  Notification,
  INotificationProps,
} from '@/domain/notification/enterprise/entities/notification';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prima.service';
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification-mapper';

export function makeNotification(
  override: Partial<INotificationProps> = {},
  id?: UniqueEntityId,
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityId('1'),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id,
  );

  return notification;
}

@Injectable()
export class NotificationFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaNotification(
    data: Partial<INotificationProps> = {},
  ): Promise<Notification> {
    const notification = makeNotification(data);

    await this.prismaService.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    });

    return notification;
  }
}
