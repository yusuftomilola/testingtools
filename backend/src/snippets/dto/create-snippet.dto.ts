import { IsString, IsOptional, IsBoolean, IsArray } from "class-validator"

export class CreateSnippetDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  code: string

  @IsString()
  language: string

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]
}
