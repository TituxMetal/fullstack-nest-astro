import type { JwtPayload } from '~/token/interfaces'
import type { UserEntity } from '~/user/entities'

export type AuthUser = {
  user: Omit<UserEntity, 'hash' | 'blocked'>
  payload: JwtPayload
}
