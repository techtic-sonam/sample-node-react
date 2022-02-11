import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/modules/entity/users.entity';
import { Repository } from 'typeorm';
import { RolesService } from '../role/role.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @Inject(forwardRef(() => RolesService))
    private readonly roleService: RolesService,
  ) {}

  async createOrUpdateUser(payload: any) {
    try {
      const User = new Users();
      if (payload.name) {
        User.name = payload.name;
      }

      if (payload.email) {
        User.email = payload.email;
      }
      if (payload.password) {
        User.password = payload.password;
      }

      if (payload.role_id) {
        User.role_id = payload.role_id;
      }
      let finalUser;
      if (payload.id) {
        await this.userRepository.update(User, payload.id);
        finalUser = await this.userRepository.find({ id: payload.id });
      } else {
        const data = await this.userRepository.save(User);
        finalUser = await this.userRepository.find({ id: data.id });
      }
      return finalUser;
    } catch (error) {
      throw error;
    }
  }

  async updateName(payload: { name: string; id: number }) {
    try {
      const user = await this.findOne({ id: payload.id });
      user.name = payload.name;
      await this.userRepository.save(user);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async createUserForDriver(payload: {
    name: string;
    email: string;
    passGenerate: string;
  }): Promise<Users> {
    try {
      const isUserAvailable = await this.findOne({ email: payload.email });
      if (isUserAvailable) {
        throw new Error('Driver is already registered');
      }
      const user = new Users();
      user.email = payload.email;
      user.name = payload.name;

      user.password = payload.passGenerate;
      user.role_id = await this.roleService.DriverRoleId();
      const newUser = await this.userRepository.save(user);
      delete user.password;
      return newUser;
    } catch (err) {
      throw err;
    }
  }

  async resetPassword(user: Users, password: string): Promise<any> {
    try {
      const response = await this.userRepository.update(user.id, {
        password,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAdmin(): Promise<Users> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'role')
        .where('role.name=:name', { name: 'admin' })
        .getOne();

      return user;
    } catch (err) {
      throw err;
    }
  }
  async delete(userId: number) {
    try {
      const user = await this.findOne({ id: userId });
      if (!user) {
        throw new NotFoundException('User Not Found!');
      }
      await this.userRepository.softRemove(user);
      return;
    } catch (err) {
      throw err;
    }
  }
  async findOne(where: any, relations: Array<any> = []): Promise<Users> {
    return this.userRepository.findOne({ where: where, relations: relations });
  }
}
