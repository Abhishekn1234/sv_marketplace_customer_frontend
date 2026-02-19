interface Feature {
  text: string;
  included: boolean;
}
export interface ServiceTierRef {
  _id: string;
  name?: string;
  code?:string;
  displayName?:string;
  description:string;
  isActive:boolean;
  createdAt?:Date;
  updatedAt?:Date;
  features?:Feature[];

}