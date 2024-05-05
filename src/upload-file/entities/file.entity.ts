import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bytea', { nullable: false })
  data: Buffer;

  @Column({ nullable: false })
  filename: string;
}