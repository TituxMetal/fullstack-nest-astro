export interface AuthenticatedUser {
  sub: string
  email: string
  username: string
  iat?: number
  exp?: number
}

export interface JwtPayload {
  sub: string
  identifier: string
  iat?: number
  exp?: number
}
