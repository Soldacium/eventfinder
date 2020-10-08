export class User{
    email: string;
    password: string;
    username: string;

    userCompanionsID: string;
    userFeedID: string;
    userDataID: string;

    privacyOptions: [{        
        profileVisible: Boolean,
        savedEventsVisible: Boolean,
        companionsVisible: Boolean,
        madeEventsVisible: Boolean,
        feedVisible: Boolean,
        emailSpecsVisible: Boolean,
        userHashCodeAllow: Boolean  }]

    _id: string;
}