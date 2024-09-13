import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../auth/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async findOne(id: string) {
    const user = await this.UserModel.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.UserModel.findOne({ _id: id });
  }
}
