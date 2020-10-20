export class UserFeed{
    posts: [{
        image: string,
        
        content: string,
        title: string,
        relatedActivities: [string],
        relatedPlace: string,
        relatedPlaceCoords: object,
        relatedEventID: string,
        relatedTags: [string],
        relatedCompanions: [],
        images: [string],

        comments: [{        
            userID: string,
            userImg: string,
            comment: string,
            username: string,
            date: string,
            responses: [{
                userID: string,
                userImg: string,
                comment: string,
                username: string,
                date: string,
            }]
        }],

        date: String,
    }]

    _id?: string;
}