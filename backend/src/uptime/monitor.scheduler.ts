import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Monitor, CheckInterval } from "./entities/monitor.entity"
import type { UptimeService } from "./uptime.service"

@Injectable()
export class MonitorScheduler {
  private readonly logger = new Logger(MonitorScheduler.name);

  constructor(
    private uptimeService: UptimeService,
    @InjectRepository(Monitor)
    private monitorRepository: Repository<Monitor>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleOneMinuteChecks() {
    await this.runChecksForInterval(CheckInterval.ONE_MINUTE)
  }

  @Cron("*/5 * * * *") // Every 5 minutes
  async handleFiveMinuteChecks() {
    await this.runChecksForInterval(CheckInterval.FIVE_MINUTES)
  }

  @Cron("*/15 * * * *") // Every 15 minutes
  async handleFifteenMinuteChecks() {
    await this.runChecksForInterval(CheckInterval.FIFTEEN_MINUTES)
  }

  @Cron("*/30 * * * *") // Every 30 minutes
  async handleThirtyMinuteChecks() {
    await this.runChecksForInterval(CheckInterval.THIRTY_MINUTES)
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyChecks() {
    await this.runChecksForInterval(CheckInterval.ONE_HOUR)
  }

  private async runChecksForInterval(interval: CheckInterval) {
    this.logger.debug(`Running checks for interval: ${interval} seconds`)

    const monitors = await this.monitorRepository.find({
      where: {
        active: true,
        interval,
      },
    })

    this.logger.debug(`Found ${monitors.length} monitors to check`)

    for (const monitor of monitors) {
      try {
        await this.uptimeService.performCheck(monitor.id)
      } catch (error) {
        this.logger.error(`Error checking monitor ${monitor.id}: ${error.message}`)
      }
    }
  }
}
