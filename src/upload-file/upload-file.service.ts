import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity'

@Injectable()
export class UploadFileService {

    constructor(
        @InjectRepository(File)
        private fileRepository: Repository<File>,
    ){}

    async saveFile(data: Buffer, filename: string): Promise<File> {
        const file = new File();
        file.data = data;
        file.filename = filename;
        return await this.fileRepository.save(file);
    }

    async getFileById(id: number) {
        return await this.fileRepository.findOneBy({id})
    }


}
