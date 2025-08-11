import { createContext } from 'react';

export interface AuthContextType {
  isLoggedIn: boolean;
  isInitialized: boolean;
  storeToken: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
