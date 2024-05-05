import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { WebSocketService } from 'src/webSockets/webSocket.service';

@Controller('room')
export class RoomController {
  
  constructor(private readonly roomService: RoomService , private readonly webSocketService: WebSocketService) {}

  @Post('/connect')
  async connectToRoom() {

    const uniqRoomId = Date.now().toString()

    this.webSocketService.createConnectionForRoom(uniqRoomId);

    return {
      roomId: uniqRoomId, 
      message: 'WebSocket connection created for room ' + uniqRoomId 
    };
  }
  
}
