import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm"
import { Monitor } from "./monitor.entity"

@Entity("checks")
export class Check {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(
    () => Monitor,
    (monitor) => monitor.checks,
    { onDelete: "CASCADE" },
  )
  monitor: Monitor

  @Column()
  monitorId: string

  @Column()
  success: boolean

  @Column({ nullable: true })
  statusCode: number

  @Column({ type: "float", nullable: true })
  responseTime: number

  @Column({ nullable: true, type: "text" })
  error: string

  @CreateDateColumn()
  createdAt: Date
}
