import { PartialType } from "@nestjs/mapped-types"
import { CreateSnippetDto } from "./create-snippet.dto"
import { IsOptional, IsBoolean } from "class-validator"

export class UpdateSnippetDto extends PartialType(CreateSnippetDto) {
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean
}
