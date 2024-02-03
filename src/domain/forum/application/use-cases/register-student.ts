import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { StudentAlreadyExistsError } from './errors/student-already-exists-error';

import { HashGenerator } from '../cryptography/hash-generator';

import { Student } from '../../enterprise/entities/student';
import { StudentsRepository } from '../repositories/students-repository';

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail =
      await this.studentsRepository.findByEmail(email);

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: hashPassword,
    });

    await this.studentsRepository.create(student);

    return right({ student });
  }
}

export { RegisterStudentUseCase };
