import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ToolSetting } from './entities/tool-setting.entity';
import { CreateToolSettingDto } from './dto/create-tool-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ToolsService {
  constructor(
    @InjectRepository(ToolSetting)
    private toolSettingsRepository: Repository<ToolSetting>,
  ) {}

  async saveSettings(
    createToolSettingDto: CreateToolSettingDto,
    userId: string,
  ): Promise<ToolSetting> {
    // Check if settings already exist for this tool and user
    const existingSettings = await this.toolSettingsRepository.findOne({
      where: {
        toolId: createToolSettingDto.toolId,
        userId,
      },
    });

    if (existingSettings) {
      // Update existing settings
      existingSettings.settings = createToolSettingDto.settings;
      return this.toolSettingsRepository.save(existingSettings);
    }

    // Create new settings
    const newSettings = this.toolSettingsRepository.create({
      ...createToolSettingDto,
      userId,
    });
    return this.toolSettingsRepository.save(newSettings);
  }

  async findUserSettings(toolId: string, userId: string): Promise<ToolSetting> {
    return this.toolSettingsRepository.findOne({
      where: {
        toolId,
        userId,
      },
    });
  }

  async removeSettings(toolId: string, userId: string): Promise<void> {
    await this.toolSettingsRepository.delete({
      toolId,
      userId,
    });
  }
}
