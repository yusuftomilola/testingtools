import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query, Res, HttpStatus } from "@nestjs/common"
import type { Response } from "express"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { ScreenshotService } from "./screenshot.service"
import type { TakeScreenshotDto } from "./dto/take-screenshot.dto"
import type { ScreenshotQueryDto } from "./dto/screenshot-query.dto"

@ApiTags("screenshots")
@Controller("screenshots")
export class ScreenshotController {
  constructor(private readonly screenshotService: ScreenshotService) {}

  @ApiOperation({ summary: "Take a screenshot of a website" })
  @ApiResponse({ status: 201, description: "Screenshot taken successfully" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async takeScreenshot(@Body() takeScreenshotDto: TakeScreenshotDto, @Request() req) {
    return this.screenshotService.takeScreenshot(takeScreenshotDto, req.user.id)
  }

  @ApiOperation({ summary: "Get all screenshots for the current user" })
  @ApiResponse({ status: 200, description: "Return all screenshots" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req, @Query() query: ScreenshotQueryDto) {
    const screenshots = await this.screenshotService.findAll(req.user.id, query)

    // Don't return the image data in the list to reduce payload size
    return screenshots.map((screenshot) => {
      const { imageData, ...rest } = screenshot
      return {
        ...rest,
        hasImage: !!imageData,
      }
    })
  }

  @ApiOperation({ summary: "Get a screenshot by ID" })
  @ApiResponse({ status: 200, description: "Return the screenshot" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(@Param('id') id: string, @Request() req) {
    const screenshot = await this.screenshotService.findOne(id, req.user.id)
    const { imageData, ...rest } = screenshot
    return {
      ...rest,
      hasImage: !!imageData,
    }
  }

  @ApiOperation({ summary: "Get screenshot image" })
  @ApiResponse({ status: 200, description: "Return the screenshot image" })
  @Get(":id/image")
  async getImage(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const { imageData, mimeType } = await this.screenshotService.getImageData(
        id,
        req.user?.id, // Optional: user may not be authenticated for public screenshots
      )

      res.setHeader("Content-Type", mimeType)
      res.setHeader("Content-Disposition", `inline; filename="screenshot-${id}.png"`)
      return res.send(imageData)
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: error.message,
      })
    }
  }

  @ApiOperation({ summary: "Delete a screenshot" })
  @ApiResponse({ status: 200, description: "Screenshot deleted successfully" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param('id') id: string, @Request() req) {
    await this.screenshotService.remove(id, req.user.id)
    return { message: "Screenshot deleted successfully" }
  }

  @ApiOperation({ summary: "Recapture a screenshot with the same settings" })
  @ApiResponse({ status: 201, description: "Screenshot recaptured successfully" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(":id/recapture")
  async recapture(@Param('id') id: string, @Request() req) {
    return this.screenshotService.recapture(id, req.user.id)
  }
}
