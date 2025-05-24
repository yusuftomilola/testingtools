import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "../../users/entities/user.entity"
import { Check } from "./check.entity"
import { Incident } from "./incident.entity"

export enum CheckInterval {
  ONE_MINUTE = 60,
  FIVE_MINUTES = 300,
  FIFTEEN_MINUTES = 900,
  THIRTY_MINUTES = 1800,
  ONE_HOUR = 3600,
}

@Entity("monitors")
export class Monitor {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column()
  url: string

  @Column({ default: true })
  active: boolean

  @Column({ type: "enum", enum: CheckInterval, default: CheckInterval.FIVE_MINUTES })
  interval: CheckInterval

  @Column({ default: 5000 }) // 5 seconds
  timeout: number

  @Column({ default: 200 })
  expectedStatusCode: number

  @Column({ nullable: true, type: "float" })
  uptimePercentage: number

  @Column({ nullable: true, type: "float" })
  averageResponseTime: number

  @Column({ nullable: true })
  lastCheckedAt: Date

  @Column({ default: false })
  isDown: boolean

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User

  @Column()
  userId: string

  @OneToMany(
    () => Check,
    (check) => check.monitor,
  )
  checks: Check[]

  @OneToMany(
    () => Incident,
    (incident) => incident.monitor,
  )
  incidents: Incident[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
