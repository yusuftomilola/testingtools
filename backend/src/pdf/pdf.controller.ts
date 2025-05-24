import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Res,
  HttpStatus,
} from "@nestjs/common"
import type { Response } from "express"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { PdfService } from "./pdf.service"
import type { CreatePdfDto } from "./dto/create-pdf.dto"
import type { UpdatePdfDto } from "./dto/update-pdf.dto"
import type { PdfQueryDto } from "./dto/pdf-query.dto"

@ApiTags("pdf")
@Controller("pdf")
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new PDF document" })
  @ApiResponse({ status: 201, description: "PDF created successfully" })
  async create(@Body() createPdfDto: CreatePdfDto, @Request() req) {
    const pdf = await this.pdfService.create(createPdfDto, req.user.id)

    // Return everything except the PDF data to keep response size small
    const { pdfData, ...result } = pdf
    return result
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all PDF documents" })
  @ApiResponse({ status: 200, description: "Return all PDFs" })
  findAll(@Query() query: PdfQueryDto, @Request() req) {
    return this.pdfService.findAll(req.user.id, query)
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get PDF document by ID" })
  @ApiResponse({ status: 200, description: "Return PDF metadata" })
  async findOne(@Param('id') id: string, @Request() req) {
    const pdf = await this.pdfService.findOne(id, req.user.id)

    // Return everything except the PDF data to keep response size small
    const { pdfData, ...result } = pdf
    return result
  }

  @Get(":id/download")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Download PDF document" })
  @ApiResponse({ status: 200, description: "Return PDF file" })
  async download(@Param('id') id: string, @Request() req, @Res() res: Response) {
    const { buffer, fileName } = await this.pdfService.getPdfData(id, req.user.id)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`)
    res.setHeader("Content-Length", buffer.length)

    res.status(HttpStatus.OK).send(buffer)
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update PDF document" })
  @ApiResponse({ status: 200, description: "PDF updated successfully" })
  async update(@Param('id') id: string, @Body() updatePdfDto: UpdatePdfDto, @Request() req) {
    const pdf = await this.pdfService.update(id, updatePdfDto, req.user.id)

    // Return everything except the PDF data to keep response size small
    const { pdfData, ...result } = pdf
    return result
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete PDF document" })
  @ApiResponse({ status: 200, description: "PDF deleted successfully" })
  remove(@Param('id') id: string, @Request() req) {
    return this.pdfService.remove(id, req.user.id)
  }

  @Post(":id/regenerate")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Regenerate PDF document" })
  @ApiResponse({ status: 200, description: "PDF regenerated successfully" })
  async regenerate(@Param('id') id: string, @Request() req) {
    const pdf = await this.pdfService.regeneratePdf(id, req.user.id)

    // Return everything except the PDF data to keep response size small
    const { pdfData, ...result } = pdf
    return result
  }
}
