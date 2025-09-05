import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '~/auth/Auth.module'
import { PrismaModule } from '~/shared/infrastructure/database'
import { UsersModule } from '~/users/Users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    UsersModule,
    AuthModule
  ]
})
export class AppModule {}
