import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity("screenshots")
export class Screenshot {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  url: string

  @Column({ nullable: true })
  title: string

  @Column("bytea")
  imageData: Buffer

  @Column({ default: "image/png" })
  mimeType: string

  @Column({ type: "jsonb" })
  settings: {
    width: number
    height: number
    fullPage: boolean
    hideAds: boolean
    waitTime: number
  }

  @Column({ default: false })
  isPublic: boolean

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User

  @Column()
  userId: string

  @CreateDateColumn()
  createdAt: Date
}
