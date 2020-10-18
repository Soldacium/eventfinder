import { Message } from './message.model';

export class Conversation{
    conversationName?: string;
    userID1: string;
    userDataID1: string;

    userID2: string;
    userDataID2: string;

    messages: []; /*{
        senderID: string,
        message: string,
        date: string,
    }*/

    nick1?: string;
    nick2?: string;

    type?: string;
    eventID?: string;

    color1?: string;
    color2?: string;


    _id?: string;
}
