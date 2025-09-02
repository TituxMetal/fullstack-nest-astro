export class LoginDto {
  constructor(
    public readonly emailOrUsername: string,
    public readonly password: string
  ) {}
}
