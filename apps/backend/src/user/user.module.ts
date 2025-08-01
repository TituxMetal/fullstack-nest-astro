import { Module } from '@nestjs/common'

import { ConfigModule } from '~/config/config.module'
import { PrismaService } from '~/prisma'
import { TokenModule } from '~/token'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [ConfigModule, TokenModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService]
})
export class UserModule {}
