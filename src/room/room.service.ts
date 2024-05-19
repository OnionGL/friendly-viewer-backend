import { Injectable } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
    ){}


    async createRoom (adminId: number , roomId: string) {
        return await this.roomRepository.save({adminId , roomId})
    }

    async addVideo(roomId: string , videoId: number) {

        const room = await this.roomRepository
                .createQueryBuilder('room')
                .where('room.roomId = :roomId', { roomId: roomId })
                .getOne();

        room.videoId = videoId

        return await this.roomRepository.update(room.id , {...room})

    }

    async getVideo (roomId: string) {

        const room = await this.roomRepository.findOneBy({ roomId })


        return {videoId: room.videoId}
    }

}
