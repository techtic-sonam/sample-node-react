import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SharedModule } from 'src/shared/shared.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    SharedModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [
        ConfigModule,
      ],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: {
            ...(
              configService.get('JWT_EXPIRATION_TIME')
                ? {
                  // expiresIn: Number(configService.get('JWT_EXPIRATION_TIME')),
                }
                : {}
            ),
          },
        };
      },
      inject: [
        ConfigService,
      ],
    }),
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthService,
  ],
})
export class AuthModule { }
