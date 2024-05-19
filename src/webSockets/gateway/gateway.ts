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

    private currentTime: number = 0

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
        
        console.log("currentTime" , this.currentTime)

        this.server.to(roomId).emit('joinedRoom', this.historyConnectedUsers[roomId]);

    }

    @SubscribeMessage('timerUpdate')
    timeUpdate(client: Socket , data: {roomId: string , time: number}) {
        this.currentTime = data.time
    }

    @SubscribeMessage('leaveRoom')
    leaveRoom(client: Socket , data: roomBody) {
        if(this.historyConnectedUsers[data.roomId]?.includes(data.currentUserId)) {
            this.historyConnectedUsers[data.roomId] = this.historyConnectedUsers[data.roomId].filter(clientId => data.currentUserId !== clientId)
        }
        this.server.to(data.roomId).emit("joinedRoom" , this.historyConnectedUsers[data.roomId])
    }

    @SubscribeMessage('addVideo')
    addVideo(client: Socket , data: any) {
        
        const roomId = data.roomId

        this.server.to(roomId).emit("addingVideo" , {videoId: data.videoId})
    }


    @SubscribeMessage('changeCurrentTimeVideo')
    changeCurrentTimeVideo(client: Socket , data: {roomId: string , currentTime: number}) {
        this.currentTime = data.currentTime
        this.server.to(data.roomId).emit("changesCurrentTimeVideo" , {currentTime: data.currentTime})
    }

    @SubscribeMessage('playVideo')
    playVideo(client: Socket , data: {roomId: string}) {
        this.server.to(data.roomId).emit("allStart" , {})
    }

    @SubscribeMessage('pauseVideo')
    pauseVideo(client: Socket , data: {roomId: string}) {
        this.server.to(data.roomId).emit("allPause" , {})
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