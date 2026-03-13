import { createApiInstance } from "../../api";

export type SignupParams = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNmber: string;
  password: string;
};
export type signUpResponse = {
    
  accessToken: string
  expiresAt: string
  user: User
}


export interface User {
  id: string
  fullName: string
  email: string
  avatarUrl: any
  isEmailVerified: boolean
}

export interface AuthResponse {
  data: AuthData;
  responseMessage: string;
  responseCode: string;
}
export interface AuthData {
  accessToken: string;
  expiresAt: string;
  user: User;
}

export type loginParams = {
    email:string;
    password:string
}
export const authInstance = createApiInstance("AUTH");

export async function signup(payload: SignupParams): Promise<signUpResponse> {
  const res = await authInstance.post("/Auth/signup", payload);
  return res.data;
}


export async function login(payload:loginParams):Promise<AuthResponse>{
     const res = await authInstance.post("/Auth/login", payload);
  return res.data;
}