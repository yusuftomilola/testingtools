import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UptimeController } from "./uptime.controller"
import { UptimeService } from "./uptime.service"
import { MonitorScheduler } from "./monitor.scheduler"
import { Monitor } from "./entities/monitor.entity"
import { Check } from "./entities/check.entity"
import { Incident } from "./entities/incident.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Monitor, Check, Incident])],
  controllers: [UptimeController],
  providers: [UptimeService, MonitorScheduler],
  exports: [UptimeService],
})
export class UptimeModule {}
