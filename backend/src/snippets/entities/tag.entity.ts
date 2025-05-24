import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn } from "typeorm"
import { Snippet } from "./snippet.entity"

@Entity("tags")
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  name: string

  @Column({ nullable: true })
  color: string

  @ManyToMany(
    () => Snippet,
    (snippet) => snippet.tags,
  )
  snippets: Snippet[]

  @CreateDateColumn()
  createdAt: Date
}
