import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import * as puppeteer from "puppeteer"
import { Screenshot } from "./entities/screenshot.entity"
import type { TakeScreenshotDto } from "./dto/take-screenshot.dto"
import type { ScreenshotQueryDto } from "./dto/screenshot-query.dto"

@Injectable()
export class ScreenshotService {
  private screenshotRepository: Repository<Screenshot>

  constructor(
    @InjectRepository(Screenshot)
    screenshotRepository: Repository<Screenshot>,
  ) {
    this.screenshotRepository = screenshotRepository;
  }

  async takeScreenshot(dto: TakeScreenshotDto, userId: string): Promise<{ id: string }> {
    try {
      // Launch a headless browser
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      })

      const page = await browser.newPage()

      // Set viewport size
      await page.setViewport({
        width: dto.width,
        height: dto.height,
      })

      // Block ads if requested
      if (dto.hideAds) {
        await page.setRequestInterception(true)
        page.on("request", (request) => {
          const url = request.url().toLowerCase()
          const adPatterns = [
            "googlesyndication.com",
            "doubleclick.net",
            "adservice.",
            "/ads/",
            "analytics.js",
            "gtm.js",
          ]

          if (adPatterns.some((pattern) => url.includes(pattern))) {
            request.abort()
          } else {
            request.continue()
          }
        })
      }

      // Navigate to the URL
      await page.goto(dto.url, {
        waitUntil: "networkidle2",
        timeout: 30000,
      })

      // Wait additional time if specified
      if (dto.waitTime > 0) {
        await page.waitForTimeout(dto.waitTime * 1000)
      }

      // Take the screenshot
      const screenshotBuffer = await page.screenshot({
        fullPage: dto.fullPage,
        type: "png",
      })

      await browser.close()

      // Create a new screenshot entity
      const screenshot = this.screenshotRepository.create({
        url: dto.url,
        title: dto.title || new URL(dto.url).hostname,
        imageData: screenshotBuffer,
        settings: {
          width: dto.width,
          height: dto.height,
          fullPage: dto.fullPage,
          hideAds: dto.hideAds,
          waitTime: dto.waitTime,
        },
        isPublic: dto.isPublic || false,
        userId,
      })

      // Save to database
      const savedScreenshot = await this.screenshotRepository.save(screenshot)

      return { id: savedScreenshot.id }
    } catch (error) {
      throw new BadRequestException(`Failed to capture screenshot: ${error.message}`)
    }
  }

  async findAll(userId: string, query: ScreenshotQueryDto): Promise<Screenshot[]> {
    const queryBuilder = this.screenshotRepository
      .createQueryBuilder("screenshot")
      .where("screenshot.userId = :userId", { userId })
      .orderBy("screenshot.createdAt", "DESC")

    if (query.url) {
      queryBuilder.andWhere("screenshot.url ILIKE :url", { url: `%${query.url}%` })
    }

    if (query.title) {
      queryBuilder.andWhere("screenshot.title ILIKE :title", { title: `%${query.title}%` })
    }

    if (query.isPublic !== undefined) {
      queryBuilder.andWhere("screenshot.isPublic = :isPublic", { isPublic: query.isPublic })
    }

    return queryBuilder.getMany()
  }

  async findPublic(id: string): Promise<Screenshot> {
    const screenshot = await this.screenshotRepository.findOne({
      where: { id, isPublic: true },
    })

    if (!screenshot) {
      throw new NotFoundException("Screenshot not found or not public")
    }

    return screenshot
  }

  async findOne(id: string, userId: string): Promise<Screenshot> {
    const screenshot = await this.screenshotRepository.findOne({
      where: { id, userId },
    })

    if (!screenshot) {
      throw new NotFoundException("Screenshot not found")
    }

    return screenshot
  }

  async getImageData(id: string, userId?: string): Promise<{ imageData: Buffer; mimeType: string }> {
    let screenshot: Screenshot

    if (userId) {
      // User is authenticated, check ownership
      screenshot = await this.findOne(id, userId)
    } else {
      // User is not authenticated, only allow public screenshots
      screenshot = await this.findPublic(id)
    }

    return {
      imageData: screenshot.imageData,
      mimeType: screenshot.mimeType,
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    const screenshot = await this.findOne(id, userId)
    await this.screenshotRepository.remove(screenshot)
  }

  async recapture(id: string, userId: string): Promise<{ id: string }> {
    const screenshot = await this.findOne(id, userId)

    const dto: TakeScreenshotDto = {
      url: screenshot.url,
      title: screenshot.title,
      ...screenshot.settings,
      isPublic: screenshot.isPublic,
    }

    // Delete the old screenshot
    await this.screenshotRepository.remove(screenshot)

    // Take a new screenshot with the same settings
    return this.takeScreenshot(dto, userId)
  }
}
