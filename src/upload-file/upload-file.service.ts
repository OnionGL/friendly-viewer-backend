import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UploadFileService {

    constructor(
        // @InjectRepository(File) private fileRepository: Repository<File>,
    ){}

    async saveFileToDB() {
        
    }


}
