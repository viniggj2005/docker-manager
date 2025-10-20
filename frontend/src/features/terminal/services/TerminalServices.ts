import { CreateSshConnection } from '../../../../wailsjs/go/handlers/SshHandler';
import { CreateSshConnectionInterface } from '../../../interfaces/TerminalInterfaces';
export const TerminalServices = {
  async createSshConnection(body: CreateSshConnectionInterface): Promise<any> {
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
};
