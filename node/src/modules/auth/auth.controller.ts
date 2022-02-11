import {
  BadRequestException,
  Body,
  Controller,
  forwardRef,
  HttpStatus,
  Inject,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { RegisterDTO } from 'src/shared/dto/register.dto';
import { ResetPasswordDTO } from 'src/shared/dto/resetPassword.dto';
import { UserService } from 'src/shared/services';
import { ForgotPasswordDTO } from '../../shared/dto/forgotPassword.dto';
import { LoginDTO } from '../../shared/dto/login.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) { }

  @Post('register')
  async register(
    @Body() RegisterPayload: RegisterDTO,
    @Res() res: Response,
  ): Promise<any> {
    try {
      return await this.authService
        .createOrUpdateUser(RegisterPayload)
        .then(async (user) => {
          if (!user) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
              message:
                'Something went wrong during register, please try again later',
            });
          } else {
            const token = this.authService.createToken(user);

            return res.status(HttpStatus.OK).json({
              status: 200,
              data: Object.assign(token, { user: user }),
            });
          }
        });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  @Post('forgot-password')
  async forgotUserPassword(
    @Body() payload: ForgotPasswordDTO,
    @Res() response: Response,
  ): Promise<any> {
    try {
      return await this.authService
        .sendForgotPasswordEmail(payload)
        .then((response_message) => {
          return response.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: response_message,
          });
        })
        .catch((error: any) => {
          throw new BadRequestException(error);
        });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('login')
  async login(@Body() payload: LoginDTO, @Res() res: Response): Promise<any> {
    return await this.authService.validateUser(payload).then(async (user) => {
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: 401,
          message: 'Invalid email or password. Please try again.',
        });
      } else {
        const token = await this.authService.createToken(user);
        return res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          data: Object.assign(token, { user: user }),
        });
      }
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reset-password')
  async resetUserPassword(
    @Request() request: any,
    @Body() payload: ResetPasswordDTO,
    @Res() response: Response,
  ): Promise<any> {
    const user = request.user;
    try {
      return await this.userService
        .resetPassword(user, payload.password)
        .then(() => {
          const token = this.authService.createToken(user);

          return response.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Password Changed Successfully!',
            data: Object.assign(token, { user }),
          });
        })
        .catch((error: any) => {
          throw new BadRequestException(error);
        });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
