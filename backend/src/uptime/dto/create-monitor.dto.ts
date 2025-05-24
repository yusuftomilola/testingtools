import { IsString, IsUrl, IsOptional, IsEnum, IsInt, Min, Max, IsBoolean } from "class-validator"
import { CheckInterval } from "../entities/monitor.entity"

export class CreateMonitorDto {
  @IsString()
  name: string

  @IsUrl()
  url: string

  @IsOptional()
  @IsBoolean()
  active?: boolean

  @IsOptional()
  @IsEnum(CheckInterval)
  interval?: CheckInterval

  @IsOptional()
  @IsInt()
  @Min(1000)
  @Max(30000)
  timeout?: number

  @IsOptional()
  @IsInt()
  expectedStatusCode?: number
}
