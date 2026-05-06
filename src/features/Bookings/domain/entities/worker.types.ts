export interface Worker{
    _id?:string;
    status?:WorkerStatus | string;
    fullName:string;
    email:string;
    profilePictureUrl:string;
    isVerified?:boolean;
    phone:string;

}
export type WorkerStatus="ONLINE"|"OFFLINE"|"BUSY"