import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { type Request } from 'express'

import { type JwtPayload } from '~/token'

interface AuthenticatedUser extends Request {
  user: JwtPayload
}

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedUser>()
    const user = request.user

    if (data && user) {
      return user[data as keyof JwtPayload]
    }

    return user
  }
)
