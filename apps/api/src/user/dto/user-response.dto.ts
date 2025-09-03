import { Expose, Type } from 'class-transformer'
import { IsBoolean, IsDate, IsEmail, IsString, IsUUID } from 'class-validator'

/**
 * UserResponseDto represents the user data that can be safely exposed through the API.
 * This DTO is used to transform User entities into API responses, ensuring that
 * sensitive data is never exposed.
 *
 * For database operations, use the User entity instead.
 */
export class UserResponseDto {
  /**
   * Unique identifier for the user
   */
  @Expose()
  @IsUUID()
  id!: string

  /**
   * User's email address
   */
  @Expose()
  @IsEmail()
  email!: string

  /**
   * User's unique username
   */
  @Expose()
  @IsString()
  username!: string

  /**
   * User's first name
   */
  @Expose()
  @IsString()
  firstName!: string | null

  /**
   * User's last name
   */
  @Expose()
  @IsString()
  lastName!: string | null

  /**
   * Whether the user's email has been verified
   */
  @Expose()
  @IsBoolean()
  confirmed!: boolean

  /**
   * When the user account was created
   */
  @Expose()
  @Type(() => Date)
  @IsDate()
  createdAt!: Date

  /**
   * When the user account was last updated
   */
  @Expose()
  @Type(() => Date)
  @IsDate()
  updatedAt!: Date
}
