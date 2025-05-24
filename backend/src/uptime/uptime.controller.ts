import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { UptimeService } from "./uptime.service"
import type { CreateMonitorDto } from "./dto/create-monitor.dto"
import type { UpdateMonitorDto } from "./dto/update-monitor.dto"
import type { MonitorQueryDto } from "./dto/monitor-query.dto"

@Controller("uptime")
@UseGuards(JwtAuthGuard)
export class UptimeController {
  constructor(private readonly uptimeService: UptimeService) {}

  @Post("monitors")
  create(@Req() req, @Body() createMonitorDto: CreateMonitorDto) {
    return this.uptimeService.create(req.user["id"], createMonitorDto)
  }

  @Get("monitors")
  findAll(@Req() req, @Query() query: MonitorQueryDto) {
    return this.uptimeService.findAll(req.user["id"], query)
  }

  @Get("monitors/:id")
  findOne(@Req() req, @Param('id') id: string) {
    return this.uptimeService.findOne(req.user["id"], id)
  }

  @Patch("monitors/:id")
  update(@Req() req, @Param('id') id: string, @Body() updateMonitorDto: UpdateMonitorDto) {
    return this.uptimeService.update(req.user["id"], id, updateMonitorDto)
  }

  @Delete("monitors/:id")
  remove(@Req() req, @Param('id') id: string) {
    return this.uptimeService.remove(req.user["id"], id)
  }

  @Post("monitors/:id/check")
  check(@Req() req, @Param('id') id: string) {
    return this.uptimeService.performCheck(id)
  }

  @Get("monitors/:id/checks")
  getChecks(@Req() req, @Param('id') id: string, @Query('limit') limit: number) {
    return this.uptimeService.getChecks(req.user["id"], id, limit)
  }

  @Get("monitors/:id/incidents")
  getIncidents(@Req() req, @Param('id') id: string, @Query('limit') limit: number) {
    return this.uptimeService.getIncidents(req.user["id"], id, limit)
  }
}
