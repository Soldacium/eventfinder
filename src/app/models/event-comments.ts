export class EventComment{

        _id?: string;
        userID: string;
        userImg: string;
        comment: string;
        username: string;
        date: string;
        responses: [{
            _id?: string,
            userID: string,
            userImg: string,
            comment: string,
            username: string,
            date: string,
        }]
}