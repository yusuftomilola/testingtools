import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ScreenshotController } from "./screenshot.controller"
import { ScreenshotService } from "./screenshot.service"
import { Screenshot } from "./entities/screenshot.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Screenshot])],
  controllers: [ScreenshotController],
  providers: [ScreenshotService],
  exports: [ScreenshotService],
})
export class ScreenshotModule {}
