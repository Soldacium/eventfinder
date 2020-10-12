export class Post{
    title: string;
    desc: string;
    relatedCompanions: [string];
    relatedPlace: string;
    relatedPlaceCoords: string;
    relatedEvent: string;
    image: string;
    images: [string];
    date: string;
    comments: [];

    timeline: boolean;
    isEvent: boolean;
    _id?: string;
}