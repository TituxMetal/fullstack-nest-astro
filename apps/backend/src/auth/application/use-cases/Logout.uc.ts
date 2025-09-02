import { Injectable } from '@nestjs/common'

export interface LogoutResult {
  success: boolean
}

interface TokenBlacklistService {
  blacklistToken(token: string): Promise<void>
}

@Injectable()
export class LogoutUseCase {
  constructor(private readonly tokenBlacklistService: TokenBlacklistService) {}

  async execute(token?: string): Promise<LogoutResult> {
    if (token) {
      await this.tokenBlacklistService.blacklistToken(token)
    }

    return { success: true }
  }
}
