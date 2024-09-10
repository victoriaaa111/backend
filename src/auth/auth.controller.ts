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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //TODO: POST Signup
  @Post('signup') //auth/signup
  async signUp(@Body() signupDate: SignupDto) {
    return this.authService.signup(signupDate);
  }

  //TODO: POST Login
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  //TODO: POST Refresh Token
  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }


// TODO: Change Password
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
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  //TODO: Reset Password
  @Put('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(
      resetPasswordDto.newPassword,
      resetPasswordDto.resetToken,
    )
  }
}