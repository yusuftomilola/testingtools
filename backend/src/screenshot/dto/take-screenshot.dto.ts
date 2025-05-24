import { IsUrl, IsInt, IsBoolean, IsOptional, Min, Max } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class TakeScreenshotDto {
  @ApiProperty({
    description: "The URL to capture",
    example: "https://example.com",
  })
  @IsUrl({
    protocols: ["http", "https"],
    require_protocol: true,
  })
  url: string

  @ApiProperty({
    description: "Optional title for the screenshot",
    required: false,
    example: "Example.com Homepage",
  })
  @IsOptional()
  title?: string

  @ApiProperty({
    description: "Viewport width in pixels",
    example: 1920,
  })
  @IsInt()
  @Min(320)
  @Max(2560)
  width: number

  @ApiProperty({
    description: "Viewport height in pixels",
    example: 1080,
  })
  @IsInt()
  @Min(320)
  @Max(2560)
  height: number

  @ApiProperty({
    description: "Whether to capture the full scrollable page",
    example: false,
  })
  @IsBoolean()
  fullPage: boolean

  @ApiProperty({
    description: "Whether to attempt to hide ads",
    example: true,
  })
  @IsBoolean()
  hideAds: boolean

  @ApiProperty({
    description: "Time to wait before taking the screenshot (in seconds)",
    example: 1,
  })
  @IsInt()
  @Min(0)
  @Max(10)
  waitTime: number

  @ApiProperty({
    description: "Whether the screenshot should be publicly accessible",
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean
}
