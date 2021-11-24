import { Transport } from '@open-rpc/client-js/build/transports/Transport';
import {
  JSONRPCRequestData,
  getNotifications,
  getBatchRequests,
  IJSONRPCData,
  IJSONRPCRequest
} from '@open-rpc/client-js/build/Request';
import { ERR_UNKNOWN, JSONRPCError } from '@open-rpc/client-js/build/Error';

export type JRPCVersion = '2.0';
export type JRPCId = number | string | void;

export interface JRPCBase {
  jsonrpc?: JRPCVersion;
  id?: JRPCId;
}

export interface JRPCRequest<T> extends JRPCBase {
  method: string;
  params?: T;
}

export interface JRPCResponse<T> extends JRPCBase {
  result?: T;
  error?: any;
}

export type SendCallBack<U> = (err: any, providerRes: U) => void;

export interface SafeEventEmitterProvider {
  sendAsync: <T, U>(req: JRPCRequest<T>) => Promise<U>;
  send: <T, U>(req: JRPCRequest<T>, callback: SendCallBack<U>) => void;
}

class ProviderTransport extends Transport {
  public provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    super();
    this.provider = provider;
  }

  public connect(): Promise<any> {
    return Promise.resolve();
  }

  public async sendData(
    data: IJSONRPCData,
    timeout: number | null = null
  ): Promise<any> {
    const prom = this.transportRequestManager.addRequest(data, timeout);
    const notifications = getNotifications(data);
    const batch = getBatchRequests(data);
    try {
      const result = await this.provider.sendAsync(
        (data.request as IJSONRPCRequest) as JRPCRequest<any>
      );
      const jsonrpcResponse = {
        id: data.request.id,
        jsonrpc: data.request.jsonrpc,
        result,
        error: null
      };
      // requirements are that notifications are successfully sent
      this.transportRequestManager.settlePendingRequest(notifications);
      if (this.onlyNotifications(data)) {
        return Promise.resolve();
      }
      const responseErr = this.transportRequestManager.resolveResponse(
        JSON.stringify(jsonrpcResponse)
      );
      if (responseErr) {
        // requirements are that batch requests are successfully resolved
        // this ensures that individual requests within the batch request are settled
        this.transportRequestManager.settlePendingRequest(batch, responseErr);
        return Promise.reject(responseErr);
      }
    } catch (e) {
      const responseErr = new JSONRPCError(e.message, ERR_UNKNOWN, e);
      this.transportRequestManager.settlePendingRequest(
        notifications,
        responseErr
      );
      this.transportRequestManager.settlePendingRequest(
        getBatchRequests(data),
        responseErr
      );
      return Promise.reject(responseErr);
    }
    return prom;
  }

  public close(): void {
    return;
  }

  private onlyNotifications = (data: JSONRPCRequestData) => {
    if (data instanceof Array) {
      return data.every(
        datum =>
          datum.request.request.id === null ||
          datum.request.request.id === undefined
      );
    }
    return data.request.id === null || data.request.id === undefined;
  };
}

export default ProviderTransport;
