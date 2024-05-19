import { Post } from "src/posts/entities/post.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Room {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    roomId: string

    @Column()
    adminId: number

    @Column({nullable: true})
    videoId: number

    @Column({nullable: true})
    videoURL: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updateAt: Date

}
