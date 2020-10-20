

export class ConversationGroup{
    conversationName?: string;

    messages: object[]; /*{
        senderID: string,
        message: string,
        date: string,
    }*/

    users: object[];
    

    color1?: string;
    color2?: string;

    makerID: string;
    eventID?: string;
    image?: string;
    type: string;

    _id?: string;
}


