import { Module } from '@nestjs/common'

import { TokenModule } from '~/token'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [TokenModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
