import { type CookieOptions } from 'express'

export interface TokenCookieOptions extends CookieOptions {
  name: string
}
