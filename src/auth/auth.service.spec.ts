import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

describe('Auth Service', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUserService = {
      find: (email: string) => {
        const filteredUser = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUser);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should create instances of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('should create a new user with salted and hashed password', async () => {
    const user = await service.signup('obaid12@gmail.com', '12345678');
    expect(user.password).not.toEqual('12345678');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw an error if email already in use', (done) => {
    service.signup('obaid122@gmail.com', '12345678').then(() => {
      service
        .signup('obaid122@gmail.com', '12345678')
        .then(() => {
        })
        .catch(() => done());
    });
  });

  it('should throw if singin is called with unused email', (done) => {
    service
      .signin('obaidxyz@gmail.com', '12345678')
      .then(() => {
      })
      .catch(() => done());
  });

  it('should throw if an invalid password is provided', (done) => {
    service.signup('obaid122@gmail.com', '12345678').then(() => {
      service
        .signin('obaid122@gmail.com', '123')
        .then(() => {})
        .catch(() => done());
    });
  });

  it('should return a user if an invalid password is provided', async () => {
    await service.signup('obaid122@gmail.com', '12345678');
    const user = await service.signin('obaid122@gmail.com', '12345678');
    expect(user).toBeDefined();
  });
});
