import { OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server , Socket } from 'socket.io'

interface roomBody {
    roomId: string,
    currentUserId: number,
    alertMessage: string,
    alertType?: AlertTypes
}

export enum AlertTypes {
    WARNING="WARNING",
    SUCCESS="SUCCESS",
    ERROR="ERROR"
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

        if(data?.alertMessage) {
            this.server.to(roomId).emit("alertMessages" , {message: data.alertMessage , alertType: data?.alertType})
        }
        
        this.server.to(roomId).emit('joinedRoom', this.historyConnectedUsers[roomId]);

        this.server.to(roomId).emit("timerUpload" , {time: this.currentTime})

    }

    @SubscribeMessage('timerUpdate')
    timeUpdate(client: Socket , data: {roomId: string , time: number}) {
        this.currentTime = data.time
        this.server.to(data.roomId).emit("timerUpload" , {time: this.currentTime})
    }


    @SubscribeMessage("removeUsers")
    removeUsers(client: Socket , data: {roomId: string , removeUserId: number}) {

        const roomId = data.roomId

        this.historyConnectedUsers[roomId] = this.historyConnectedUsers[roomId].filter(userId => userId !== data.removeUserId)

        this.server.to(roomId).emit('removeUserId' , data.removeUserId)

        this.server.to(roomId).emit('joinedRoom', this.historyConnectedUsers[roomId]);
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