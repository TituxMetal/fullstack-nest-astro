import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PrismaModule } from '~/prisma'
import { UserModule } from '~/user'

import { AuthModule } from './auth/auth.module'
import { TokenModule } from './token/token.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    TokenModule
  ]
})
export class AppModule {}
