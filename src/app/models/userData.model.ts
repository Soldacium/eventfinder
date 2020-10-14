export class UserData{
    email: string;
    username: string;
    phone?: string;
    address?: string;
    website1?: string;
    website2?: string;
    desc?: string;
    statsTypes?: Array<object>;
    statsTime?: Array<object>;
    image?: string;
    backgroundImage?: string;
    
    comments?: Array<object>;

    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;

    saved?: Array<{_id: string, id: string}>;

    activities?: Array<string>;

    _id?: string;
}