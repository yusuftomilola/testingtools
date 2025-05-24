import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ToolsController } from "./tools.controller"
import { ToolsService } from "./tools.service"
import { ToolSetting } from "./entities/tool-setting.entity"

@Module({
  imports: [TypeOrmModule.forFeature([ToolSetting])],
  controllers: [ToolsController],
  providers: [ToolsService],
})
export class ToolsModule {}
