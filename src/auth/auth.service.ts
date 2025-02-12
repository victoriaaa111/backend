import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { ResetToken } from './schemas/reset-token.schema';
import { ResetWorkerToken } from './schemas/reset-token.worker.schema';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { MailService } from 'src/services/mail.service';
import { SignupWorkerDto } from './dtos/signup.worker.dto';
import { Worker } from './schemas/worker.schema';
import { LoginWorkerDto } from './dtos/login.worker.dto';
import { Admin } from './schemas/admin.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name)
    private ResetTokenModel: Model<ResetToken>,
    @InjectModel(ResetWorkerToken.name)
    private ResetWorkerTokenModel: Model<ResetWorkerToken>,
    @InjectModel(Worker.name) private WorkerModel: Model<Worker>,
    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  //user

  async signup(signupData: SignupDto) {
    const { email, password, fullName } = signupData;
    //check if email is in use
    const emailInUse = await this.UserModel.findOne({
      email,
    });
    if (emailInUse) {
      throw new BadRequestException('Email already exists');
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    let unique = uuidv4();
    unique = unique.replace(/-/g, '').substr(0, 6);
    //create user document and save in mongodb
    await this.UserModel.create({
      fullName,
      uniqueId: unique,
      email,
      password: hashedPassword,
      isActive: true,
    });
  }

  async login(credentials: LoginDto) {
    const { email, password } = credentials;
    //find if user exists by email
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Wrong credentials');
    }
    if (user.isActive == false) {
      throw new BadRequestException('inactive user');
    }
    //compare entered password with existing password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('Wrong credentials');
    }
    //generate jwt tokens
    const tokens = await this.generateToken(user._id);
    return {
      ...tokens,
      userId: user._id,
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

    return this.generateToken(token.id);
  }

  async generateToken(id) {
    const accessToken = this.jwtService.sign({ id }, { expiresIn: '1h' });
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, id);
    return { accessToken, refreshToken };
  }

  async storeRefreshToken(token: string, id) {
    // calculate expiry date 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    await this.RefreshTokenModel.updateOne(
      { id },
      { $set: { expiryDate, token } },
      {
        upsert: true,
      },
    );
  }

  async changePassword(userId, oldPassword: string, newPassword: string) {
    // Find the user
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found...');
    }
    //Compare the old password with rhe password in DB
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }
    //Change user's password (DON'T FORGET TO HASH IT)
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }

  async forgotPassword(email: string) {
    //Check that user exists
    const user = await this.UserModel.findOne({ email });

    if (user) {
      //If user exists, generate password reset link
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const resetToken = nanoid(64);
      await this.ResetTokenModel.create({
        token: resetToken,
        userId: user._id,
        expiryDate,
      });
      //Send the link to the user by email (nodemailer)
      await this.mailService.sendPasswordResetEmail(email, resetToken);
    }

    return { message: 'If this user exists, they will receive an email.' };
  }

  async resetPassword(newPassword: string, resetToken: string) {
    //Find a valid reset token document
    const token = await this.ResetTokenModel.findOneAndDelete({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid link');
    }
    //Change user password
    const user = await this.UserModel.findById(token.userId);
    if (!user) {
      throw new InternalServerErrorException();
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }

  //todo worker

  async changePasswordWorker(
    workerId,
    oldPassword: string,
    newPassword: string,
  ) {
    // Find the user
    const worker = await this.WorkerModel.findById(workerId);
    if (!worker) {
      throw new NotFoundException('Worker not found...');
    }
    //Compare the old password with rhe password in DB
    const passwordMatch = await bcrypt.compare(oldPassword, worker.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }
    //Change user's password (DON'T FORGET TO HASH IT)
    worker.password = await bcrypt.hash(newPassword, 10);
    await worker.save();
  }

  async forgotPasswordWorker(email: string) {
    //Check that user exists
    const worker = await this.WorkerModel.findOne({ email });

    if (worker) {
      //If user exists, generate password reset link
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const resetTokenWorker = nanoid(64);
      await this.ResetTokenModel.create({
        token: resetTokenWorker,
        workerId: worker._id,
        expiryDate,
      });
      //Send the link to the user by email (nodemailer)
      this.mailService.sendPasswordResetEmail(email, resetTokenWorker);
    }

    return { message: 'If this worker exists, they will receive an email.' };
  }

  async resetPasswordWorker(newPassword: string, resetToken: string) {
    //Find a valid reset token document
    const token = await this.ResetWorkerTokenModel.findOneAndDelete({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid link');
    }
    //Change user password
    const worker = await this.WorkerModel.findById(token.workerId);
    if (!worker) {
      throw new InternalServerErrorException();
    }

    worker.password = await bcrypt.hash(newPassword, 10);
    await worker.save();
  }

  async changePasswordAdmin(adminId, oldPassword: string, newPassword: string) {
    // Find the user
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin not found...');
    }
    //Compare the old password with rhe password in DB
    const passwordMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }
    //Change user's password (DON'T FORGET TO HASH IT)
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
  }

  //worker authentication

  async signupWorker(signupData: SignupWorkerDto) {
    const { email, password, fullName, contact } = signupData;
    //check if email is in use
    const emailInUse = await this.WorkerModel.findOne({ email });
    if (emailInUse) {
      throw new BadRequestException('Email already exists');
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    let unique = uuidv4();
    unique = unique.replace(/-/g, '').substr(0, 6);
    //create user document an`d save in mongodb
    await this.WorkerModel.create({
      fullName,
      email,
      contact,
      uniqueId: unique,
      rating: 0,
      password: hashedPassword,
      isActive: true,
    });
  }

  //worker login
  async loginWorker(credentials: LoginWorkerDto) {
    const { email, password } = credentials;
    //find if user exists by email
    const worker = await this.WorkerModel.findOne({ email });
    if (!worker) {
      throw new BadRequestException('Wrong credentials');
    }
    if (worker.isActive == false) {
      throw new BadRequestException('inactive user');
    }
    //compare entered password with existing password
    const passwordMatch = await bcrypt.compare(password, worker.password);
    if (!passwordMatch) {
      throw new BadRequestException('Wrong credentials');
    }
    //generate jwt tokens
    const tokens = await this.generateToken(worker._id);
    return {
      ...tokens,
      workerId: worker._id,
    };
  }

  async loginAdmin(credentials: LoginDto) {
    const { email, password } = credentials;
    const admin = await this.adminModel.findOne({ email });
    if (!admin) {
      throw new BadRequestException('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    const tokens = await this.generateToken(admin._id);
    return {
      ...tokens,
      adminId: admin._id,
    };
  }
}
