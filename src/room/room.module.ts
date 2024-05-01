import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { WebSocketService } from 'src/webSockets/webSocket.service';
import { Gateway } from 'src/webSockets/gateway/gateway';

@Module({
  controllers: [RoomController],
  providers: [RoomService , WebSocketService , Gateway],
})
export class RoomModule {}
