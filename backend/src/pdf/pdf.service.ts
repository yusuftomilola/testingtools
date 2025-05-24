import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import * as puppeteer from "puppeteer"
import * as handlebars from "handlebars"
import type { PdfDocument } from "./entities/pdf-document.entity"
import type { CreatePdfDto } from "./dto/create-pdf.dto"
import type { UpdatePdfDto } from "./dto/update-pdf.dto"
import type { PdfQueryDto } from "./dto/pdf-query.dto"

@Injectable()
export class PdfService {
  constructor(private pdfRepository: Repository<PdfDocument>) {}

  async create(createPdfDto: CreatePdfDto, userId: string): Promise<PdfDocument> {
    const { settings, contentBlocks, isPublic = false } = createPdfDto

    // Generate PDF buffer
    const pdfBuffer = await this.generatePdfBuffer(settings, contentBlocks)

    // Create new PDF document entity
    const pdfDocument = this.pdfRepository.create({
      title: settings.title,
      description: settings.title, // Can be expanded later
      settings,
      contentBlocks,
      pdfData: pdfBuffer,
      fileName: `${this.sanitizeFileName(settings.title)}.pdf`,
      fileSize: pdfBuffer.length,
      isPublic,
      userId,
    })

    // Save to database
    return this.pdfRepository.save(pdfDocument)
  }

  async findAll(userId: string, query: PdfQueryDto): Promise<PdfDocument[]> {
    const { search, onlyMine = false } = query

    const queryBuilder = this.pdfRepository.createQueryBuilder("pdf")

    // Filter by ownership or public status
    if (onlyMine) {
      queryBuilder.where("pdf.userId = :userId", { userId })
    } else {
      queryBuilder.where("(pdf.userId = :userId OR pdf.isPublic = :isPublic)", {
        userId,
        isPublic: true,
      })
    }

    // Add search if provided
    if (search) {
      queryBuilder.andWhere("(pdf.title ILIKE :search OR pdf.description ILIKE :search)", {
        search: `%${search}%`,
      })
    }

    // Order by creation date, newest first
    queryBuilder.orderBy("pdf.createdAt", "DESC")

    // Don't return the actual PDF data in the list to reduce payload size
    queryBuilder.select([
      "pdf.id",
      "pdf.title",
      "pdf.description",
      "pdf.fileName",
      "pdf.fileSize",
      "pdf.isPublic",
      "pdf.createdAt",
      "pdf.updatedAt",
      "pdf.userId",
    ])

    return queryBuilder.getMany()
  }

  async findOne(id: string, userId: string): Promise<PdfDocument> {
    const pdf = await this.pdfRepository.findOne({
      where: [
        { id, userId },
        { id, isPublic: true },
      ],
    })

    if (!pdf) {
      throw new NotFoundException(`PDF with ID ${id} not found or access denied`)
    }

    return pdf
  }

  async update(id: string, updatePdfDto: UpdatePdfDto, userId: string): Promise<PdfDocument> {
    // First check if the PDF exists and belongs to the user
    const pdf = await this.pdfRepository.findOne({
      where: { id, userId },
    })

    if (!pdf) {
      throw new NotFoundException(`PDF with ID ${id} not found or access denied`)
    }

    // If settings or content blocks are updated, regenerate the PDF
    if (updatePdfDto.settings || updatePdfDto.contentBlocks) {
      const settings = updatePdfDto.settings || pdf.settings
      const contentBlocks = updatePdfDto.contentBlocks || pdf.contentBlocks

      // Generate new PDF buffer
      const pdfBuffer = await this.generatePdfBuffer(settings, contentBlocks)

      // Update entity
      pdf.settings = settings
      pdf.contentBlocks = contentBlocks
      pdf.pdfData = pdfBuffer
      pdf.fileSize = pdfBuffer.length

      // Update title and filename if title changed
      if (updatePdfDto.settings?.title) {
        pdf.title = settings.title
        pdf.fileName = `${this.sanitizeFileName(settings.title)}.pdf`
      }
    }

    // Update isPublic if provided
    if (updatePdfDto.isPublic !== undefined) {
      pdf.isPublic = updatePdfDto.isPublic
    }

    // Save updated PDF
    return this.pdfRepository.save(pdf)
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.pdfRepository.delete({ id, userId })

    if (result.affected === 0) {
      throw new NotFoundException(`PDF with ID ${id} not found or access denied`)
    }
  }

  async getPdfData(id: string, userId: string): Promise<{ buffer: Buffer; fileName: string }> {
    const pdf = await this.findOne(id, userId)

    return {
      buffer: pdf.pdfData,
      fileName: pdf.fileName,
    }
  }

  async regeneratePdf(id: string, userId: string): Promise<PdfDocument> {
    const pdf = await this.findOne(id, userId)

    // Regenerate PDF buffer
    const pdfBuffer = await this.generatePdfBuffer(pdf.settings, pdf.contentBlocks)

    // Update entity
    pdf.pdfData = pdfBuffer
    pdf.fileSize = pdfBuffer.length

    // Save updated PDF
    return this.pdfRepository.save(pdf)
  }

  private async generatePdfBuffer(settings: any, contentBlocks: any[]): Promise<Buffer> {
    // Create HTML template
    const htmlContent = this.generateHtml(settings, contentBlocks)

    // Launch browser
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    try {
      const page = await browser.newPage()

      // Set content
      await page.setContent(htmlContent, { waitUntil: "networkidle0" })

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: settings.pageSize,
        landscape: settings.orientation === "landscape",
        margin: {
          top: `${settings.margins.top}mm`,
          right: `${settings.margins.right}mm`,
          bottom: `${settings.margins.bottom}mm`,
          left: `${settings.margins.left}mm`,
        },
        printBackground: true,
        displayHeaderFooter: settings.headerEnabled || settings.footerEnabled,
        headerTemplate: settings.headerEnabled
          ? this.generateHeaderFooterTemplate(settings.headerText, settings.title)
          : " ",
        footerTemplate: settings.footerEnabled
          ? this.generateHeaderFooterTemplate(settings.footerText, settings.title)
          : " ",
      })

      return pdfBuffer
    } finally {
      await browser.close()
    }
  }

  private generateHtml(settings: any, contentBlocks: any[]): string {
    // Basic HTML template
    const template = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>{{title}}</title>
        <style>
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
          }
          h1 { font-size: 24px; margin-top: 24px; margin-bottom: 16px; }
          h2 { font-size: 20px; margin-top: 24px; margin-bottom: 16px; }
          h3 { font-size: 18px; margin-top: 24px; margin-bottom: 16px; }
          h4 { font-size: 16px; margin-top: 24px; margin-bottom: 16px; }
          p { margin-top: 16px; margin-bottom: 16px; }
          img { max-width: 100%; }
          table { border-collapse: collapse; width: 100%; margin: 16px 0; }
          table, th, td { border: 1px solid #ddd; }
          th, td { padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          pre { background-color: #f5f5f5; padding: 16px; overflow: auto; border-radius: 4px; }
          code { font-family: 'Courier New', monospace; }
        </style>
      </head>
      <body>
        {{#each blocks}}
          {{{content}}}
        {{/each}}
      </body>
      </html>
    `

    // Compile template
    const compiledTemplate = handlebars.compile(template)

    // Process content blocks
    const blocks = contentBlocks.map((block) => {
      return {
        content: this.processContentBlock(block),
      }
    })

    // Render template
    return compiledTemplate({
      title: settings.title,
      blocks,
    })
  }

  private processContentBlock(block: any): string {
    switch (block.type) {
      case "heading":
        const level = block.options?.level || 1
        return `<h${level}>${block.content}</h${level}>`

      case "text":
        return `<p>${block.content}</p>`

      case "image":
        const width = block.options?.width || "auto"
        const alt = block.options?.alt || ""
        return `<img src="${block.content}" alt="${alt}" width="${width}" />`

      case "table":
        try {
          const tableData = JSON.parse(block.content)
          let tableHtml = "<table>"

          tableData.forEach((row, rowIndex) => {
            tableHtml += "<tr>"
            row.forEach((cell, cellIndex) => {
              if (rowIndex === 0) {
                tableHtml += `<th>${cell}</th>`
              } else {
                tableHtml += `<td>${cell}</td>`
              }
            })
            tableHtml += "</tr>"
          })

          tableHtml += "</table>"
          return tableHtml
        } catch (error) {
          return `<p>Error parsing table data: ${error.message}</p>`
        }

      case "code":
        const language = block.options?.language || "plaintext"
        return `<pre><code class="language-${language}">${block.content}</code></pre>`

      case "html":
        return block.content

      default:
        return `<p>${block.content}</p>`
    }
  }

  private generateHeaderFooterTemplate(text: string, title: string): string {
    if (!text) return " "

    // Replace variables
    const template = text
      .replace(/\{title\}/g, title)
      .replace(/\{pageNumber\}/g, '<span class="pageNumber"></span>')
      .replace(/\{totalPages\}/g, '<span class="totalPages"></span>')

    return `
      <div style="font-size: 10px; width: 100%; padding: 0 20px; display: flex; justify-content: space-between;">
        <span>${template}</span>
      </div>
    `
  }

  private sanitizeFileName(fileName: string): string {
    return fileName
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }
}
