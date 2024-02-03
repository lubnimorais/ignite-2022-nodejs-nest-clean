import { DomainEvents } from '@/core/events/domain-events';

import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Student } from '@/domain/forum/enterprise/entities/student';

class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = [];

  async create(student: Student): Promise<void> {
    this.items.push(student);

    DomainEvents.dispatchEventsForAggregate(student.id);
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((item) => item.email === email);

    if (!student) {
      return null;
    }

    return student;
  }
}

export { InMemoryStudentsRepository };
