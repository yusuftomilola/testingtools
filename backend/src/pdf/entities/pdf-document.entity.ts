import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity("pdf_documents")
export class PdfDocument {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column({ nullable: true })
  description: string

  @Column({ type: "jsonb" })
  settings: Record<string, any>

  @Column({ type: "jsonb" })
  contentBlocks: Record<string, any>[]

  @Column({ type: "bytea" })
  pdfData: Buffer

  @Column()
  fileName: string

  @Column()
  fileSize: number

  @Column({ default: false })
  isPublic: boolean

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User

  @Column()
  userId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
