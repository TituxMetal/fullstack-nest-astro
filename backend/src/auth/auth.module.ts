import { Module } from '@nestjs/common'

import { TokenModule } from '~/token'
import { UserModule } from '~/user'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [UserModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
