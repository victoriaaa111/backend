import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'uriel.schmitt74@ethereal.email',
        pass: 'rwCUK815RX4EWF6xgS',
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `localhost:3001/auth/reset-password?token=${token}`;
    const mailOptions = {
      from: 'Auth-backend service',
      to: to,
      subject: 'Password Reset Request',
      html: `<p> You requested a password reset. Click the link below to reset your password: </p> <p><a href="${resetLink}">Reset Password</a></p>`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
