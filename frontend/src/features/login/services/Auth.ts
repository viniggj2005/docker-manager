import { Me } from '../../../../wailsjs/go/handlers/UserHandler';
import { Login, Logout } from '../../../../wailsjs/go/handlers/AuthHandler';

export const myInfo = (token: string) => Me(token);

export async function logoutApi(token: string) {
  return Logout(token);
}
export async function loginApi(email: string, password: string) {
  return Login({ email, password });
}
