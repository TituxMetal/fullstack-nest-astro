import type { UserEntity } from '~/user/entities'

export type AuthUser = {
  user: Omit<UserEntity, 'hash' | 'blocked'>
  token: string
}
