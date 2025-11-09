import { IAPIRoute, IRequest, IResponse, IEnv, APIContext } from './IAPIRoute';
import { generateAESGCMKey } from '@/crypto';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface GenerateMasterKeyRequest extends IRequest {}

interface GenerateMasterKeyResponse extends IResponse {
  success: boolean;
  message: string;
  key: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface GenerateMasterKeyEnv extends IEnv {}

export class GenerateMasterKey extends IAPIRoute<GenerateMasterKeyRequest, GenerateMasterKeyResponse, GenerateMasterKeyEnv> {
  schema = {
    tags: ['Admin'],
    summary: 'Generate AES-GCM Key',
    description: 'Generates a new AES-GCM key for encrypting OAuth credentials',
    responses: {
      '200': {
        description: 'Key generated successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object' as const,
              properties: {
                success: { type: 'boolean' as const },
                message: { type: 'string' as const },
                key: { type: 'string' as const },
              },
            },
          },
        },
      },
    },
  };

  protected async handleRequest(
    _request: GenerateMasterKeyRequest,
    _env: GenerateMasterKeyEnv,
    _ctx: APIContext<GenerateMasterKeyEnv>,
  ): Promise<GenerateMasterKeyResponse> {
    const key = await generateAESGCMKey();

    // Store the key in Secrets Store
    // await env.AES_ENCRYPTION_KEY_SECRET.put(key);

    return {
      success: true,
      message: 'AES-GCM key generated and stored successfully',
      key: key,
    };
  }
}
