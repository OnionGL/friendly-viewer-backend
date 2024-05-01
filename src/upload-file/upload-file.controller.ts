import { Body, Controller, Get, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import {Response} from 'express'

interface FileParams {
  fileName:string
}

@Controller('upload-file')
export class UploadFileController {

  constructor(private readonly uploadFileService: UploadFileService) {}

  @Post('/file')
  @UseInterceptors(FileInterceptor('file' , {
    storage: diskStorage({
      destination: './files',
      filename: (req , file , callback) => {
        
        callback(null , `${file.originalname}`)

      }
    })
  }))
  handleUpload(@UploadedFile() file: Express.Multer.File) {}

  @Get('/getFile')
  getFile(@Res() res: Response , @Body() file: FileParams) {
    res.sendFile(path.join(__dirname , '../../files/' + file.fileName))
  }


}
