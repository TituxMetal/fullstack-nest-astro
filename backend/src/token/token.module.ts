import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { ConfigModule, ConfigService } from '~/config'

import { TokenService } from './token.service'

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.jwt.secret,
        signOptions: { expiresIn: configService.jwt.expiresIn }
      })
    })
  ],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
