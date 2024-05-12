import { OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server , Socket } from 'socket.io'

interface roomBody {
    roomId: string,
    currentUserId: number,
}


@WebSocketGateway({ cors: true })
export class Gateway implements OnModuleInit  {

    private historyMessages: { [roomId: string]: string[] } = {};

    private historyConnectedUsers: { [roomId: string]: number[] } = {};

    @WebSocketServer()
    public server: Server

    public onModuleInit() {
        this.server.on('connection' , (socket) => {})
    }

    @SubscribeMessage('joinRoom')
    public handleJoinRoom(client: Socket, data: roomBody) {

        const roomId = data.roomId

        const currentUserId = data.currentUserId

        client.join(roomId);

        if(!this.historyConnectedUsers[roomId]) {
            this.historyConnectedUsers[roomId] = []
        }

        if(!this.historyConnectedUsers[roomId].includes(currentUserId)) {
            this.historyConnectedUsers[roomId].push(currentUserId)
        }

        if (this.historyMessages[roomId]) {
            client.emit('history', this.historyMessages[roomId]);
        }
        
        this.server.to(roomId).emit('joinedRoom', this.historyConnectedUsers[roomId]);

    }

    @SubscribeMessage('leaveRoom')
    leaveRoom(client: Socket , data: roomBody) {
        
    }

    @SubscribeMessage('addVideo')
    addVideo(client: Socket , data: any) {
        
        const roomId = data.roomId

        this.server.to(roomId).emit("addingVideo" , {videoId: data.videoId})
    }

    @SubscribeMessage('sendMessage')
    handleMessage(client: Socket, message: any) {
        
        const room = message.room;
        const content = message.content;

        if(!this.historyMessages[room]) {
            this.historyMessages[room] = []
        }

        this.historyMessages[room].push(content)

        this.server.to(message.room).emit('roomMessage', { room: message.room, content: message.content });
    }

}