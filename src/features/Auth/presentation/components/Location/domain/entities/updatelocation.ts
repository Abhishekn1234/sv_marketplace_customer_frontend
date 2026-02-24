export interface Address {
  id: string;
  type: "home" | "office" |"inputValue" | "other"| string;
  value: string;
}

export interface LastLocations {
  id?: string;
  addresses: Address[];
}