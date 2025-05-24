import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ToolsService } from './tools.service';
import { CreateToolSettingDto } from './dto/create-tool-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('tools')
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @ApiOperation({ summary: 'Save tool settings' })
  @ApiResponse({ status: 201, description: 'Tool settings saved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('settings')
  create(@Body() createToolSettingDto: CreateToolSettingDto, @Request() req) {
    return this.toolsService.saveSettings(createToolSettingDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get tool settings for current user' })
  @ApiResponse({ status: 200, description: 'Return tool settings' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('settings/:toolId')
  findOne(@Param('toolId') toolId: string, @Request() req) {
    return this.toolsService.findUserSettings(toolId, req.user.id);
  }

  @ApiOperation({ summary: 'Delete tool settings' })
  @ApiResponse({
    status: 200,
    description: 'Tool settings deleted successfully',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('settings/:toolId')
  remove(@Param('toolId') toolId: string, @Request() req) {
    return this.toolsService.removeSettings(toolId, req.user.id);
  }
}
