import { Exclude } from 'class-transformer'

export class User {
  id: string
  email: string
  username: string
  firstName: string | null
  lastName: string | null

  @Exclude()
  hash: string

  confirmed: boolean

  @Exclude()
  blocked: boolean

  createdAt: Date
  updatedAt: Date
}
