import { Create } from '../../../../wailsjs/go/handlers/UserHandler';
import type { UserDTO } from '../../../interfaces/AuthInterfaces';

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

export async function createUserApi(payload: CreateUserPayload): Promise<UserDTO> {
  return Create({
    nome: payload.name,
    email: payload.email,
    password: payload.password,
  });
}
