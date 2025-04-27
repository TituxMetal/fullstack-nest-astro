import { IsOptional } from 'class-validator'

import { IsName, IsUsername } from '~/shared/validation'

/**
 * DTO for updating user profile
 * Uses shared validation decorators from ~/shared/validation/decorators
 * Validation rules are defined in ~/shared/validation/constants
 */
export class UpdateUserDto {
  @IsUsername()
  @IsOptional()
  username?: string

  @IsName()
  @IsOptional()
  firstName?: string

  @IsName()
  @IsOptional()
  lastName?: string
}
