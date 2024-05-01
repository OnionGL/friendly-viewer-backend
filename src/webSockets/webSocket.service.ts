import { Injectable } from '@nestjs/common';
import { Gateway } from './gateway/gateway';

@Injectable()
export class WebSocketService {
    constructor(private readonly websocketGateway: Gateway) {}

    public createConnectionForRoom(roomId: string) {
        this.websocketGateway.server.to(roomId).emit('onJoinRoom', { message: 'Connected to room ' + roomId });
    }

    // public sendMessageToRoom(roomId: string, event: string, data: any) {
    //     this.websocketGateway.sendToRoom(roomId, event, data);
    // }
}