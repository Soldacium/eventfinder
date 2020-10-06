export class User{
    email: string;
    password: string;
    name: string;
    phone?: string;
    address?: string;
    website1?: string;
    website2?: string;
    desc?: string;
    statsTypes?: Array<object>;
    statsTime?: Array<object>;
    image?: string;
    _id?: string;
    comments?: Array<object>;

    saved?: Array<{_id: string, id: string}>;
}