import { OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server , Socket } from 'socket.io'

interface roomBody {
    roomId: string
}


@WebSocketGateway({ cors: true })
export class Gateway implements OnModuleInit  {
    private roomMessages: Map<string , string[]> = new Map();
    @WebSocketServer()
    public server: Server

    public onModuleInit() {
        this.server.on('connection' , (socket) => {
            
        })
    }

    @SubscribeMessage('joinRoom')
    public handleJoinRoom(client: Socket, room: string) {
        client.join(room);
        if (this.roomMessages.get(room)) {
            client.emit('history', this.roomMessages.get(room));
        }
        client.emit('joinedRoom', room);
    }

    @SubscribeMessage('sendMessage')
    handleMessage(client: Socket, message: any) {
        
        const room = message.room;
        const content = message.content;

        this.roomMessages.set(room , content)

        this.server.to(message.room).emit('roomMessage', { room: message.room, content: message.content });
    }

}