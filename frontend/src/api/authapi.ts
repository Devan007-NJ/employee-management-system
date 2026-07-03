//for creating login and register api calls
import api from "./AxiosInstance";

export interface Register {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
}

export interface login {
  username: string;
  password: string;

}

export interface AuthResponse {
  access: string;
  refresh: string;
  user : {
    _id: string;
    username: string;
    email: string;
    role: 'admin' | 'employee';
  }
}

export const registerUser = async (payload : Register) => {
    let response = await api.post<AuthResponse>('/register/', payload);
    return response.data;
}

export const loginUser = async(payload : login) : Promise<AuthResponse> => {
    let response = await api.post<AuthResponse>('/login/', payload);
    return response.data;
}

