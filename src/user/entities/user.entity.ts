import { Post } from "src/posts/entities/post.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    name: string

    @Column()
    email: string

    @Column()
    password: string

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[]

    @Column({ nullable: true })
    imageId: number | null

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updateAt: Date

}
