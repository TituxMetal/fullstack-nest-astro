import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

import { VALIDATION } from '~/shared/validation/constants'
import { IsName, IsPassword, IsUsername } from '~/shared/validation/decorators'

/**
 * DTO for user registration
 * Uses shared validation decorators from ~/shared/validation/decorators
 * Validation rules are defined in ~/shared/validation/constants
 */
export class RegisterDto {
  @IsEmail({}, { message: VALIDATION.EMAIL.MESSAGE })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(VALIDATION.EMAIL.MAX_LENGTH, {
    message: `Email must not exceed ${VALIDATION.EMAIL.MAX_LENGTH} characters`
  })
  email: string

  @IsUsername()
  @IsNotEmpty({ message: 'Username is required' })
  username: string

  @IsPassword()
  @IsNotEmpty({ message: 'Password is required' })
  password: string

  @IsName()
  @IsOptional()
  firstName?: string

  @IsName()
  @IsOptional()
  lastName?: string
}
