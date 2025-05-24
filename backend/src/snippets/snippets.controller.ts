import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from "@nestjs/common"
import type { SnippetsService } from "./snippets.service"
import type { CreateSnippetDto } from "./dto/create-snippet.dto"
import type { UpdateSnippetDto } from "./dto/update-snippet.dto"
import type { SnippetQueryDto } from "./dto/snippet-query.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@Controller("snippets")
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createSnippetDto: CreateSnippetDto, @Request() req) {
    return this.snippetsService.create(createSnippetDto, req.body, req.user.userId)
  }

  @Get()
  findAll(@Query() query: SnippetQueryDto, @Request() req) {
    const userId = req.user?.userId
    return this.snippetsService.findAll(query, userId)
  }

  @Get("tags")
  findAllTags() {
    return this.snippetsService.findAllTags()
  }

  @Get('stats/languages')
  getLanguageStats(@Request() req) {
    const userId = req.user?.userId;
    return this.snippetsService.getLanguageStats(userId);
  }

  @Get(":id")
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.userId
    return this.snippetsService.findOne(id, userId)
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateSnippetDto: UpdateSnippetDto, @Request() req) {
    return this.snippetsService.update(id, updateSnippetDto, req.user.userId)
  }

  @Post(":id/favorite")
  @UseGuards(JwtAuthGuard)
  toggleFavorite(@Param('id') id: string, @Request() req) {
    return this.snippetsService.toggleFavorite(id, req.user.userId)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.snippetsService.remove(id, req.user.userId)
  }
}
