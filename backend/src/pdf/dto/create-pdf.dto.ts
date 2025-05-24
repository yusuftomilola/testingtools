import { IsString, IsObject, IsArray, IsOptional, IsBoolean, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

class PdfSettingsDto {
  @IsString()
  title: string

  @IsString()
  @IsOptional()
  author?: string

  @IsString()
  pageSize: string

  @IsString()
  orientation: string

  @IsObject()
  margins: {
    top: number
    right: number
    bottom: number
    left: number
  }

  @IsBoolean()
  headerEnabled: boolean

  @IsString()
  @IsOptional()
  headerText?: string

  @IsBoolean()
  footerEnabled: boolean

  @IsString()
  @IsOptional()
  footerText?: string
}

class ContentBlockDto {
  @IsString()
  type: string

  @IsString()
  content: string

  @IsObject()
  @IsOptional()
  options?: Record<string, any>
}

export class CreatePdfDto {
  @IsObject()
  @ValidateNested()
  @Type(() => PdfSettingsDto)
  settings: PdfSettingsDto

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  contentBlocks: ContentBlockDto[]

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean
}
