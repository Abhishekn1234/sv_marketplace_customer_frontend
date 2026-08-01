import { LocalizedText } from "@/components/common/localizedtext.types";

interface Feature {
  text: string;
  included: boolean;
}
export interface ServiceTierRef {
  _id: string;
  tierId?:string;
  name?: LocalizedText;
  code?:string;
  displayName?:LocalizedText;
  description:LocalizedText;
  isActive:boolean;
  createdAt?:Date;
  updatedAt?:Date;
  features?:Feature[];

}