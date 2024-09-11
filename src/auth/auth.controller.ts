import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
// import { AuthGuard } from './guards/auth.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignupWorkerDto } from './dtos/signup.worker.dto';
import { LoginWorkerDto } from './dtos/login.worker.dto';
import { AdminRefreshTokenDto } from "./dtos/admin.refresh-token.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //POST Signup for user
  @Post('signup') //auth/signup
  async signUp(@Body() signupDate: SignupDto) {
    return this.authService.signup(signupDate);
  }

  //POST Login for user
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  //POST Refresh Token
  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  //Change Password
  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ) {
    return this.authService.changePassword(
      req.userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  //Reset Password
  @Put('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.newPassword,
      resetPasswordDto.resetToken,
    );
  }

  //POST Signup for worker
  @Post('worker/signup') //auth/signup
  async signUpWorker(@Body() signupWorkerDate: SignupWorkerDto) {
    return this.authService.signupWorker(signupWorkerDate);
  }

  //todo: POST Login for worker
  @Post('worker/login')
  async loginWorker(@Body() credentials: LoginWorkerDto) {
    return this.authService.loginWorker(credentials);
  }

  //todo: Refresh Token for worker
  @Post('worker/refresh')
  async refreshTokensWorker(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokenWorker(refreshTokenDto.refreshToken);
  }

  //todo: Change Password for worker

  //todo: Reset Password for worker

  //POST Login admin
  @Post('admin/login')
  async loginAdmin(@Body() credentials: LoginDto) {
    return this.authService.loginAdmin(credentials);
  }
  //TODO: POST Refresh Token
  @Post('admin/refresh')
  async refreshTokensAdmin(@Body() refreshTokenDto: AdminRefreshTokenDto) {
    return this.authService.refreshAdminToken(refreshTokenDto.refreshToken);
  }
}
