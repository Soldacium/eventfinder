export class Event{
    title: string;
    organisator: string;
    type: string;
    tags: Array<string>;
    time: {
        start: string,
        end: string
    };
    address: string;
    coords: {lat: number, lon: number};
    price: number;
    additional: Array<string>;
    website1?: string;
    website2?: string;
    email?: string;
    phone?: string;

    ticketsLink?: string;

    desc: string;
    plan: Array<{
        name: string;
        desc: string;
        time?: string;
    }>;

    iconImg: any;
    userID: string;
    _id?: string;

    commentsID?:string;
    participantsID?:string;

}
