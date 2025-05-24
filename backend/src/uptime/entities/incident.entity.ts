import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm"
import { Monitor } from "./monitor.entity"

@Entity("incidents")
export class Incident {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(
    () => Monitor,
    (monitor) => monitor.incidents,
    { onDelete: "CASCADE" },
  )
  monitor: Monitor

  @Column()
  monitorId: string

  @CreateDateColumn()
  startedAt: Date

  @Column({ nullable: true })
  resolvedAt: Date

  @Column({ nullable: true, type: "float" })
  duration: number // in seconds

  @Column({ nullable: true, type: "text" })
  reason: string
}
