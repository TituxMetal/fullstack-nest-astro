import { IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  username?: string

  @IsString()
  @IsOptional()
  firstName?: string

  @IsString()
  @IsOptional()
  lastName?: string
}
