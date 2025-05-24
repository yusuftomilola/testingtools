import { IsOptional, IsString, IsBoolean } from "class-validator"

export class PdfQueryDto {
  @IsString()
  @IsOptional()
  search?: string

  @IsBoolean()
  @IsOptional()
  onlyMine?: boolean
}
