import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Snippet } from "./entities/snippet.entity"
import type { Tag } from "./entities/tag.entity"
import type { CreateSnippetDto } from "./dto/create-snippet.dto"
import type { UpdateSnippetDto } from "./dto/update-snippet.dto"
import type { SnippetQueryDto } from "./dto/snippet-query.dto"

@Injectable()
export class SnippetsService {
  constructor(
    private snippetRepository: Repository<Snippet>,
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createSnippetDto: CreateSnippetDto, userId: string): Promise<Snippet> {
    const { tags: tagNames, ...snippetData } = createSnippetDto

    const snippet = this.snippetRepository.create({
      ...snippetData,
      userId,
    })

    if (tagNames && tagNames.length > 0) {
      const tags = await this.findOrCreateTags(tagNames)
      snippet.tags = tags
    }

    return this.snippetRepository.save(snippet)
  }

  async findAll(query: SnippetQueryDto, userId?: string): Promise<{ snippets: Snippet[]; total: number }> {
    const { search, language, tags, isPublic, isFavorite, page, limit } = query

    const queryBuilder = this.snippetRepository
      .createQueryBuilder("snippet")
      .leftJoinAndSelect("snippet.tags", "tag")
      .leftJoinAndSelect("snippet.user", "user")

    // If user is provided, show their snippets + public snippets
    // If no user, show only public snippets
    if (userId) {
      queryBuilder.where("(snippet.userId = :userId OR snippet.isPublic = true)", { userId })
    } else {
      queryBuilder.where("snippet.isPublic = true")
    }

    if (search) {
      queryBuilder.andWhere(
        "(snippet.title ILIKE :search OR snippet.description ILIKE :search OR snippet.code ILIKE :search)",
        { search: `%${search}%` },
      )
    }

    if (language) {
      queryBuilder.andWhere("snippet.language = :language", { language })
    }

    if (isPublic !== undefined) {
      queryBuilder.andWhere("snippet.isPublic = :isPublic", { isPublic })
    }

    if (isFavorite !== undefined && userId) {
      queryBuilder.andWhere("snippet.isFavorite = :isFavorite", { isFavorite })
      queryBuilder.andWhere("snippet.userId = :userId", { userId })
    }

    if (tags) {
      const tagNames = tags.split(",")
      queryBuilder.andWhere("tag.name IN (:...tagNames)", { tagNames })
    }

    queryBuilder.orderBy("snippet.updatedAt", "DESC")

    const total = await queryBuilder.getCount()
    const snippets = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany()

    return { snippets, total }
  }

  async findOne(id: string, userId?: string): Promise<Snippet> {
    const snippet = await this.snippetRepository.findOne({
      where: { id },
      relations: ["tags", "user"],
    })

    if (!snippet) {
      throw new NotFoundException("Snippet not found")
    }

    // Check if user can access this snippet
    if (!snippet.isPublic && snippet.userId !== userId) {
      throw new ForbiddenException("Access denied")
    }

    return snippet
  }

  async update(id: string, updateSnippetDto: UpdateSnippetDto, userId: string): Promise<Snippet> {
    const snippet = await this.findOne(id, userId)

    if (snippet.userId !== userId) {
      throw new ForbiddenException("You can only update your own snippets")
    }

    const { tags: tagNames, ...updateData } = updateSnippetDto

    Object.assign(snippet, updateData)

    if (tagNames) {
      const tags = await this.findOrCreateTags(tagNames)
      snippet.tags = tags
    }

    return this.snippetRepository.save(snippet)
  }

  async remove(id: string, userId: string): Promise<void> {
    const snippet = await this.findOne(id, userId)

    if (snippet.userId !== userId) {
      throw new ForbiddenException("You can only delete your own snippets")
    }

    await this.snippetRepository.remove(snippet)
  }

  async toggleFavorite(id: string, userId: string): Promise<Snippet> {
    const snippet = await this.findOne(id, userId)

    if (snippet.userId !== userId) {
      throw new ForbiddenException("You can only favorite your own snippets")
    }

    snippet.isFavorite = !snippet.isFavorite
    return this.snippetRepository.save(snippet)
  }

  async findAllTags(): Promise<Tag[]> {
    return this.tagRepository.find({
      order: { name: "ASC" },
    })
  }

  async getLanguageStats(userId?: string): Promise<{ language: string; count: number }[]> {
    const queryBuilder = this.snippetRepository
      .createQueryBuilder("snippet")
      .select("snippet.language", "language")
      .addSelect("COUNT(*)", "count")
      .groupBy("snippet.language")
      .orderBy("count", "DESC")

    if (userId) {
      queryBuilder.where("(snippet.userId = :userId OR snippet.isPublic = true)", { userId })
    } else {
      queryBuilder.where("snippet.isPublic = true")
    }

    return queryBuilder.getRawMany()
  }

  private async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    const tags: Tag[] = []

    for (const tagName of tagNames) {
      let tag = await this.tagRepository.findOne({ where: { name: tagName } })

      if (!tag) {
        tag = this.tagRepository.create({ name: tagName })
        tag = await this.tagRepository.save(tag)
      }

      tags.push(tag)
    }

    return tags
  }
}
