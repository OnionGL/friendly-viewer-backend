import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'

@WebSocketGateway()
export class Gateway implements OnModuleInit {

    @WebSocketServer()
    private server: Server

    public onModuleInit() {
        this.server.on('connection' , (socket) => {
            console.log("socket ID" , socket.id)
            console.log('Connected')
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