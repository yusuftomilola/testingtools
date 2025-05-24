import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class ToolSetting {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  toolId: string

  @Column()
  userId: string

  @Column("jsonb")
  settings: Record<string, any>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
