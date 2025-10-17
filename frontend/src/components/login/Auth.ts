import { Me } from '../../../wailsjs/go/handlers/UserHandler';
import { Login, Logout } from '../../../wailsjs/go/handlers/AuthHandler';

export async function loginApi(email: string, password: string) {
  return Login({ email, password });
}

export async function logoutApi(token: string) {
  return Logout(token);
}

export const meApi = (token: string) => Me(token);
