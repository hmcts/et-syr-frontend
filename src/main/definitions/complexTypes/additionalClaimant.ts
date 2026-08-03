import { AddressUK } from '../case';

export interface AdditionalClaimantType {
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  address?: AddressUK;
}
