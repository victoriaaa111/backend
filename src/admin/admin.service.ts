import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../auth/schemas/admin.schema';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../auth/dtos/admin.login.dto';
import { JwtService } from '@nestjs/jwt';
import { AdminRefreshToken } from '../auth/schemas/admin.refresh-token.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../auth/schemas/user.schema';
import { Worker } from '../auth/schemas/worker.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
    @InjectModel(AdminRefreshToken.name)
    private RefreshTokenModel: Model<AdminRefreshToken>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Worker.name) private WorkerModel: Model<Worker>,
    private jwtService: JwtService,
  ) {}

  async login(credentials: LoginDto) {
    const { email, password } = credentials;
    const admin = await this.adminModel.findOne({ email });
    if (!admin) {
      throw new BadRequestException('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    const tokens = await this.generateAdminToken(admin._id);
    return {
      ...tokens,
      adminId: admin._id,
    };
  }

  async refreshToken(refreshToken: string) {
    const token = await this.RefreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Wrong token');
    }

    return this.generateAdminToken(token.adminId);
  }

  async generateAdminToken(adminId) {
    const accessToken = this.jwtService.sign({ adminId }, { expiresIn: '1h' });
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, adminId);
    return { accessToken, refreshToken };
  }

  async storeRefreshToken(token: string, adminId) {
    // calculate expiry date 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    await this.RefreshTokenModel.updateOne(
      { adminId },
      { $set: { expiryDate, token } },
      {
        upsert: true,
      },
    );
  }
}
