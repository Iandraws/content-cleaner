import axiosClient from "./axiosClient"; 
export interface LoginRequest {
  key: string;
}

export interface LoginResponse {
  token: string;
}

export async function loginApiKey(key: string): Promise<LoginResponse> {
  const { data } = await axiosClient.post<LoginResponse>("/login", { key } as LoginRequest);
  return data;
}

export async function ping(): Promise<boolean> {
  try {
    const response = await axiosClient.get("/ping");
    return response.status === 200;
  } catch {
    return false;
  }
}
