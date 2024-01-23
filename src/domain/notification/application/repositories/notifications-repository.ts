import { Notification } from '../../enterprise/entities/notification';

interface INotificationsRepository {
  create(notification: Notification): Promise<void>;
  findById(id: string): Promise<Notification | null>;
  save(notification: Notification): Promise<void>;
}

export { INotificationsRepository };
