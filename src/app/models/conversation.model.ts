import { Message } from './message.model';

export class Conversation{
    userID1: string;
    userID2: string;
    userName1: string;
    userName2: string;
    userImg1: string;
    userImg2: string;
    eventName: string;
    messages: Array<Message>;
    _id?: string;
}
