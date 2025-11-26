export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  provider?: string | null;
  locale?: string | null;
  updatedAt?: number;
  createdAt?: number;
};
