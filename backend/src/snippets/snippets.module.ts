import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { SnippetsController } from "./snippets.controller"
import { SnippetsService } from "./snippets.service"
import { Snippet } from "./entities/snippet.entity"
import { Tag } from "./entities/tag.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Snippet, Tag])],
  controllers: [SnippetsController],
  providers: [SnippetsService],
  exports: [SnippetsService],
})
export class SnippetsModule {}
