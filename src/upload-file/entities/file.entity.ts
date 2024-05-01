import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    fileName: string

    @CreateDateColumn()
    createdAt: Date
    
    @UpdateDateColumn()
    updateAt: Date

}
