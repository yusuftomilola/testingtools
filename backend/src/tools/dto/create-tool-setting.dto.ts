import { IsNotEmpty, IsString, IsObject } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateToolSettingDto {
  @ApiProperty({ description: "Tool identifier" })
  @IsNotEmpty()
  @IsString()
  toolId: string

  @ApiProperty({ description: "Tool settings as JSON object" })
  @IsNotEmpty()
  @IsObject()
  settings: Record<string, any>
}
