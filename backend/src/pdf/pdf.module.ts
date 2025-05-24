import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PdfController } from "./pdf.controller"
import { PdfService } from "./pdf.service"
import { PdfDocument } from "./entities/pdf-document.entity"
import { UsersModule } from "../users/users.module"

@Module({
  imports: [TypeOrmModule.forFeature([PdfDocument]), UsersModule],
  controllers: [PdfController],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}
