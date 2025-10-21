import {
  GetById,
  CreateSshConnection,
  FindAllConnectionByUser,
} from '../../../../wailsjs/go/handlers/SshHandler';
import { normalizeKey } from '../functions/TreatmentFunctions';
import type { terminal as termNS } from '../../../../wailsjs/go/models';
import type { CreateSshConnectionInterface, SshDto } from '../../../interfaces/TerminalInterfaces';

export function toSshConn(dto: SshDto): termNS.SSHConn {
  return {
    Host: dto.host,
    Port: dto.port ?? 22,
    User: dto.systemUser,
    Password: '',
    Key: Array.from(normalizeKey(dto.key)),
    KeyPath: dto.keyPath ?? '',
    Passphrase: dto.passphrase ?? '',
    KnownHostsPath: '',
    InsecureIgnoreHostKey: true,
    Cols: 0,
    Rows: 0,
    Timeout: 0,
  };
}
export const TerminalServices = {
  async createSshConnection(body: CreateSshConnectionInterface) {
    const payload = {
      host: body.host,
      systemUser: body.systemUser,
      port: body.port,
      key: body.key,
      knownHosts: body.knownHosts,
      userId: body.userId,
    };
    return await CreateSshConnection(payload);
  },

  async findAllByUser(userId: number, token: string): Promise<SshDto[]> {
    if (!Number.isFinite(userId)) throw new Error('userId inválido');
    const connectionsList = await FindAllConnectionByUser(token, userId);
    return Array.isArray(connectionsList) ? (connectionsList as SshDto[]) : [];
  },

  async getById(token: string, id: number): Promise<SshDto> {
    const connectionObject = await GetById(token, Number(id));
    return connectionObject as SshDto;
  },
};
