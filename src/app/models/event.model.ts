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

    desc: string;
    plan: Array<{
        name: string;
        desc: string;
        time?: string;
    }>;

    iconImg: any;
    // imageIDs: Array<string>;
    votes: {
        yes: number;
        no: number;
        maybe: number;
    };
    comments?: [{
        _id?: string,
        userID: string,
        userImg: string,
        comment: string,
        username: string,
        date: string,
        responses: [{
            _id?: string,
            userID: string,
            userImg: string,
            comment: string,
            username: string,
            date: string,
        }]
    }]
    userID: string;
    _id?: string;

}
