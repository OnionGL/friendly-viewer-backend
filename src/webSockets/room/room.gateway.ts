import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway()
export class RoomGateway implements OnModuleInit {

  constructor(private readonly roomService: RoomService) { }

  @WebSocketServer()
  private server: Server

  public onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log("socket room ID", socket.id)
      console.log('Connected room')
    })
  }

  @SubscribeMessage('newMessage')
  public newMessage(@MessageBody() body: any) {
      this.server.emit('onMessage' , {
          msg: 'new message',
          content: body
      })
  }

}
