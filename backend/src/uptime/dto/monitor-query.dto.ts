import { IsOptional, IsBoolean, IsEnum } from "class-validator"
import { CheckInterval } from "../entities/monitor.entity"

export class MonitorQueryDto {
  @IsOptional()
  @IsBoolean()
  active?: boolean

  @IsOptional()
  @IsEnum(CheckInterval)
  interval?: CheckInterval

  @IsOptional()
  @IsBoolean()
  isDown?: boolean
}
