import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { AuthService } from '~/auth/application/services'
import { LoginUseCase, LogoutUseCase, RegisterUseCase } from '~/auth/application/use-cases'
import { type IAuthUserRepository } from '~/auth/domain/repositories'
import { AuthController } from '~/auth/infrastructure/controllers'
import { JwtAuthGuard } from '~/auth/infrastructure/guards'
import { PrismaAuthUserRepository } from '~/auth/infrastructure/repositories'
import { JwtService, PasswordService } from '~/auth/infrastructure/services'
import { PrismaModule } from '~/prisma'

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IAuthUserRepository',
      useClass: PrismaAuthUserRepository
    },
    {
      provide: 'PasswordService',
      useClass: PasswordService
    },
    {
      provide: 'JwtService',
      useClass: JwtService
    },
    {
      provide: 'IdGenerator',
      useFactory: () => ({
        generate: () => `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      })
    },
    {
      provide: 'TokenBlacklistService',
      useFactory: () => ({
        blacklistToken: (token: string) => {
          console.log(`Blacklisting token: ${token}`)
          return Promise.resolve()
        }
      })
    },
    {
      provide: LoginUseCase,
      useFactory: (
        authUserRepository: IAuthUserRepository,
        passwordService: PasswordService,
        jwtService: JwtService
      ) => new LoginUseCase(authUserRepository, passwordService, jwtService),
      inject: ['IAuthUserRepository', 'PasswordService', 'JwtService']
    },
    {
      provide: RegisterUseCase,
      useFactory: (
        authUserRepository: IAuthUserRepository,
        passwordService: PasswordService,
        idGenerator: { generate(): string }
      ) => new RegisterUseCase(authUserRepository, passwordService, idGenerator),
      inject: ['IAuthUserRepository', 'PasswordService', 'IdGenerator']
    },
    {
      provide: LogoutUseCase,
      useFactory: (tokenBlacklistService: { blacklistToken(token: string): Promise<void> }) =>
        new LogoutUseCase(tokenBlacklistService),
      inject: ['TokenBlacklistService']
    },
    AuthService,
    JwtAuthGuard
  ],
  exports: [AuthService, JwtAuthGuard]
})
export class AuthModule {}
