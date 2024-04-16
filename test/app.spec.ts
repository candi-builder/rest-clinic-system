import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserController } from 'src/user/user/user.controller';
import { UserService } from 'src/user/user/user.service';
import { RegisterUserRequest, UserResponse } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userController: UserController;
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [UserController],
      providers: [UserService, PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userController = moduleFixture.get<UserController>(UserController);
    userService = moduleFixture.get<UserService>(UserService);
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const registerUserRequest: RegisterUserRequest = {
        uuid: '123456',
        username: 'testuser',
        password: 'testpassword',
        role: Role.SUPERADMIN,
        full_name: 'Test User',
      };

      jest.spyOn(userService, 'register').mockResolvedValue({
        username: 'testuser',
        full_name: 'Test User',
        uuid: 'test-uuid',
        role: Role.SUPERADMIN,
        password: 'testpassword',
      });

      const response = await userController.registerUser(registerUserRequest);

      expect(response).toEqual<WebResponse<UserResponse>>({
        data: {
          uuid: '123456',
          username: 'testuser',
          password: 'testpassword',
          role: Role.SUPERADMIN,
          full_name: 'Test User',
        },
      });
    });
  });
});
