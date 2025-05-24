import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
  @ApiProperty({ description: "User name" })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: "User email" })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ description: "User password" })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string
}
