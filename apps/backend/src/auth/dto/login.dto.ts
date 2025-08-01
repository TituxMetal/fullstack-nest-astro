import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'

import { IsPassword, VALIDATION } from '~/shared/validation'

/**
 * DTO for user login
 * Uses shared validation decorators from ~/shared/validation/decorators
 * Validation rules are defined in ~/shared/validation/constants
 */
export class LoginDto {
  @IsNotEmpty({ message: 'Identifier is required' })
  @MinLength(VALIDATION.USERNAME.MIN_LENGTH, {
    message: `Identifier must be at least ${VALIDATION.USERNAME.MIN_LENGTH} characters long`
  })
  @MaxLength(VALIDATION.EMAIL.MAX_LENGTH, {
    message: `Identifier must not exceed ${VALIDATION.EMAIL.MAX_LENGTH} characters`
  })
  identifier: string

  @IsPassword()
  @IsNotEmpty({ message: 'Password is required' })
  password: string
}
