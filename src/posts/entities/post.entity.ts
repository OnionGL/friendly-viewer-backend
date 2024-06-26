import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    title:string

    @ManyToOne(() => User , (user) => user.id)
    @JoinColumn({name: 'user_id'})
    user: User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updateAt: Date

}
