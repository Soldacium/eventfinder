export class Post{
    title: string;
    content: string;
    relatedCompanions: string[];
    relatedActivities: string[];
    relatedPlace: string;
    relatedPlaceCoords: object;
    relatedEventID: string;
    relatedTags: string[];
    image: string;
    images: string[];
    date: string;
    comments: [];

    timeline: boolean;
    isEvent: boolean;
    _id?: string;
}