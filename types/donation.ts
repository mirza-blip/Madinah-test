export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreditCard {
  number: string;
  expiry: string;
  cvv: string;
}

export interface UpsellDownsellAmounts {
  upsellAmount: number;
  downsellAmount: number;
}
