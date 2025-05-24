import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { type Repository, Between } from "typeorm"
import axios from "axios"
import { Monitor } from "./entities/monitor.entity"
import { Check } from "./entities/check.entity"
import { Incident } from "./entities/incident.entity"
import type { CreateMonitorDto } from "./dto/create-monitor.dto"
import type { UpdateMonitorDto } from "./dto/update-monitor.dto"
import type { MonitorQueryDto } from "./dto/monitor-query.dto"

@Injectable()
export class UptimeService {
  private monitorRepository: Repository<Monitor>
  private checkRepository: Repository<Check>
  private incidentRepository: Repository<Incident>

  constructor(
    @InjectRepository(Monitor)
    monitorRepository: Repository<Monitor>,
    @InjectRepository(Check)
    checkRepository: Repository<Check>,
    @InjectRepository(Incident)
    incidentRepository: Repository<Incident>,
  ) {
    this.monitorRepository = monitorRepository
    this.checkRepository = checkRepository
    this.incidentRepository = incidentRepository
  }

  async create(userId: string, createMonitorDto: CreateMonitorDto): Promise<Monitor> {
    const monitor = this.monitorRepository.create({
      ...createMonitorDto,
      userId,
    })
    return this.monitorRepository.save(monitor)
  }

  async findAll(userId: string, query: MonitorQueryDto): Promise<Monitor[]> {
    return this.monitorRepository.find({
      where: {
        userId,
        ...query,
      },
      order: {
        createdAt: "DESC",
      },
    })
  }

  async findOne(userId: string, id: string): Promise<Monitor> {
    const monitor = await this.monitorRepository.findOne({
      where: { id, userId },
      relations: ["checks", "incidents"],
    })

    if (!monitor) {
      throw new NotFoundException(`Monitor with ID ${id} not found`)
    }

    return monitor
  }

  async update(userId: string, id: string, updateMonitorDto: UpdateMonitorDto): Promise<Monitor> {
    const monitor = await this.findOne(userId, id)

    Object.assign(monitor, updateMonitorDto)

    return this.monitorRepository.save(monitor)
  }

  async remove(userId: string, id: string): Promise<void> {
    const monitor = await this.findOne(userId, id)
    await this.monitorRepository.remove(monitor)
  }

  async performCheck(monitorId: string): Promise<Check> {
    const monitor = await this.monitorRepository.findOne({
      where: { id: monitorId },
    })

    if (!monitor) {
      throw new NotFoundException(`Monitor with ID ${monitorId} not found`)
    }

    if (!monitor.active) {
      throw new BadRequestException("Monitor is not active")
    }

    const check = new Check()
    check.monitorId = monitorId

    const startTime = Date.now()

    try {
      const response = await axios.get(monitor.url, {
        timeout: monitor.timeout,
        validateStatus: () => true, // Don't throw on any status code
      })

      const endTime = Date.now()
      const responseTime = endTime - startTime

      check.success = response.status === monitor.expectedStatusCode
      check.statusCode = response.status
      check.responseTime = responseTime

      if (!check.success) {
        check.error = `Expected status ${monitor.expectedStatusCode}, got ${response.status}`
      }
    } catch (error) {
      check.success = false
      check.error = error.message
    }

    const savedCheck = await this.checkRepository.save(check)

    // Update monitor stats
    await this.updateMonitorStats(monitor.id)

    // Handle status change
    await this.handleStatusChange(monitor, check.success)

    return savedCheck
  }

  private async updateMonitorStats(monitorId: string): Promise<void> {
    const monitor = await this.monitorRepository.findOne({
      where: { id: monitorId },
    })

    if (!monitor) return

    // Get all checks in the last 24 hours
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    const recentChecks = await this.checkRepository.find({
      where: {
        monitorId,
        createdAt: Between(oneDayAgo, new Date()),
      },
    })

    if (recentChecks.length === 0) return

    // Calculate uptime percentage
    const successfulChecks = recentChecks.filter((check) => check.success).length
    const uptimePercentage = (successfulChecks / recentChecks.length) * 100

    // Calculate average response time
    const successfulChecksWithTime = recentChecks.filter((check) => check.success && check.responseTime)
    let averageResponseTime = 0

    if (successfulChecksWithTime.length > 0) {
      const totalResponseTime = successfulChecksWithTime.reduce((sum, check) => sum + check.responseTime, 0)
      averageResponseTime = totalResponseTime / successfulChecksWithTime.length
    }

    // Update monitor
    await this.monitorRepository.update(monitorId, {
      uptimePercentage,
      averageResponseTime,
      lastCheckedAt: new Date(),
    })
  }

  private async handleStatusChange(monitor: Monitor, isSuccess: boolean): Promise<void> {
    const wasDown = monitor.isDown
    const isDown = !isSuccess

    // Status changed from up to down
    if (!wasDown && isDown) {
      // Create new incident
      const incident = new Incident()
      incident.monitorId = monitor.id
      incident.reason = "Service is down"
      await this.incidentRepository.save(incident)

      // Update monitor status
      await this.monitorRepository.update(monitor.id, { isDown: true })
    }

    // Status changed from down to up
    if (wasDown && !isDown) {
      // Find the latest unresolved incident
      const latestIncident = await this.incidentRepository.findOne({
        where: {
          monitorId: monitor.id,
          resolvedAt: null,
        },
        order: { startedAt: "DESC" },
      })

      if (latestIncident) {
        // Calculate duration
        const startTime = latestIncident.startedAt.getTime()
        const endTime = Date.now()
        const durationSeconds = (endTime - startTime) / 1000

        // Resolve the incident
        await this.incidentRepository.update(latestIncident.id, {
          resolvedAt: new Date(),
          duration: durationSeconds,
        })
      }

      // Update monitor status
      await this.monitorRepository.update(monitor.id, { isDown: false })
    }
  }

  async getChecks(userId: string, monitorId: string, limit = 20): Promise<Check[]> {
    // Verify the monitor belongs to the user
    await this.findOne(userId, monitorId)

    return this.checkRepository.find({
      where: { monitorId },
      order: { createdAt: "DESC" },
      take: limit,
    })
  }

  async getIncidents(userId: string, monitorId: string, limit = 10): Promise<Incident[]> {
    // Verify the monitor belongs to the user
    await this.findOne(userId, monitorId)

    return this.incidentRepository.find({
      where: { monitorId },
      order: { startedAt: "DESC" },
      take: limit,
    })
  }
}
