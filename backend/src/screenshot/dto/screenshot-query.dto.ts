import { IsOptional, IsBoolean, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"

export class ScreenshotQueryDto {
  @ApiProperty({
    description: "Filter by URL (partial match)",
    required: false,
  })
  @IsOptional()
  @IsString()
  url?: string

  @ApiProperty({
    description: "Filter by title (partial match)",
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({
    description: "Filter by public/private status",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  isPublic?: boolean
}
