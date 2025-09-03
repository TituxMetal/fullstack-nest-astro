import { Module } from '@nestjs/common'

import { AuthModule } from '~/auth/Auth.module'
import { ConfigModule } from '~/config/config.module'
import { PrismaService } from '~/prisma'
import { TokenModule } from '~/token'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [ConfigModule, TokenModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService]
})
export class UserModule {}
