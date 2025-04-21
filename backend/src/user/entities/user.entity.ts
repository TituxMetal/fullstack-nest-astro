export type User = {
  id: string
  email: string
  username: string
  firstName: string | null
  lastName: string | null
  hash: string
  confirmed: boolean
  blocked: boolean
  createdAt: Date
  updatedAt: Date
}
