import { Exclude } from 'class-transformer'

/**
 * User entity represents the complete user data structure in the database.
 * This entity is used for database operations and contains all user data,
 * including sensitive fields that should not be exposed through the API.
 *
 * For API responses, use UserResponseDto instead.
 */
export class UserEntity {
  /**
   * Unique identifier for the user
   */
  id!: string

  /**
   * User's email address
   */
  email!: string

  /**
   * User's unique username
   */
  username!: string

  /**
   * User's first name
   */
  firstName!: string | null

  /**
   * User's last name
   */
  lastName!: string | null

  /**
   * Hashed password - should never be exposed
   */
  @Exclude()
  hash!: string

  /**
   * Whether the user's email has been verified
   */
  confirmed!: boolean

  /**
   * Whether the user is blocked from accessing the system
   */
  @Exclude()
  blocked!: boolean

  /**
   * When the user account was created
   */
  createdAt!: Date

  /**
   * When the user account was last updated
   */
  updatedAt!: Date
}
