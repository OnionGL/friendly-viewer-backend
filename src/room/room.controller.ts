import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { WebSocketService } from 'src/webSockets/webSocket.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('room')
export class RoomController {
  
  constructor(private readonly roomService: RoomService , private readonly webSocketService: WebSocketService) {}

  @Post('/connect')
  async connectToRoom(@Body() body: CreateRoomDto) {

    const uniqRoomId = Date.now().toString()

    const adminId = body.adminId

    this.roomService.createRoom(adminId , uniqRoomId)

    this.webSocketService.createConnectionForRoom(uniqRoomId);

    return {
      roomId: uniqRoomId, 
      message: 'WebSocket connection created for room ' + uniqRoomId 
    };
  }

  @Post('/video')
  async addVideo(@Body() body: {roomId: string , videoId: number}) {
     return this.roomService.addVideo(body.roomId , body.videoId)
  }

  @Post('/videoUrl')
  async addVidoeByUrl(@Body() body: {roomId: string , videoUrl: string}) {
    return this.roomService.addVideoByUrl(body.roomId , body.videoUrl)
  }

  @Get('/:roomId')
  getVideo(@Param("roomId") roomId: string) {
    return this.roomService.getVideo(roomId)
  }

  @Get('/admin/:roomId')
  getAdminUser(@Param("roomId") roomId: string){
    return this.roomService.getAdminUser(roomId)
  }
  
}
