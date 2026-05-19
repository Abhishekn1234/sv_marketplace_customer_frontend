export interface ServiceRatingReview{
    bookingId:string;
    serviceRating:number;
    workerRating:number;
    feedback:string;
    tags?:string[];
}