import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '~/auth/Auth.module'
import { PrismaModule } from '~/prisma'
import { UserModule } from '~/user'

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
