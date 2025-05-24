import { IsOptional, IsString, IsBoolean } from "class-validator"
import { Transform } from "class-transformer"

export class SnippetQueryDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  language?: string

  @IsOptional()
  @IsString()
  tags?: string

  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  isPublic?: boolean

  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  isFavorite?: boolean

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  page?: number = 1

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  limit?: number = 20
}
