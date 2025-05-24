import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "../../users/entities/user.entity"
import { Tag } from "./tag.entity"

@Entity("snippets")
export class Snippet {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "text" })
  code: string

  @Column()
  language: string

  @Column({ default: false })
  isPublic: boolean

  @Column({ default: false })
  isFavorite: boolean

  @ManyToOne(
    () => User,
    (user) => user.id,
    { onDelete: "CASCADE" },
  )
  user: User

  @Column()
  userId: string

  @ManyToMany(
    () => Tag,
    (tag) => tag.snippets,
    { cascade: true },
  )
  @JoinTable({
    name: "snippet_tags",
    joinColumn: { name: "snippetId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tagId", referencedColumnName: "id" },
  })
  tags: Tag[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
