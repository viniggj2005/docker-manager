import {
  FindAllByUser,
  CreateDockerConnection,
} from '../../../../wailsjs/go/handlers/DockerHandlerStruct';
import {
  DockerCredentialSummary,
  CreateDockerCredentialPayload,
} from '../../../interfaces/DockerCredentialInterfaces';
import { mapCredential, toBase64 } from '../functions/treatmentFunctions';
import { AddDockerClient } from '../../../../wailsjs/go/handlers/DockerSdkHandlerStruct';

export const DockerCredentialService = {
  async create(token: string, payload: CreateDockerCredentialPayload): Promise<void> {
    const body = {
      alias: payload.alias,
      url: payload.url,
      ca: toBase64(payload.ca),
      cert: toBase64(payload.cert),
      key: toBase64(payload.key),
      userId: payload.userId,
    };
    await CreateDockerConnection(token, body);
  },

  async list(token: string, userId: number): Promise<DockerCredentialSummary[]> {
    const response = await FindAllByUser(token, userId);
    if (!Array.isArray(response)) return [];
    return response
      .map(mapCredential)
      .filter((credential): credential is DockerCredentialSummary => Boolean(credential));
  },

  async connect(credentialId: number): Promise<void> {
    await AddDockerClient(credentialId);
  },
};
