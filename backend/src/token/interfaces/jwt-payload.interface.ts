export interface JwtPayload {
  sub: string
  identifier: string
  iat?: number
  exp?: number
}
