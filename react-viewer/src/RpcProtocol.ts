import { BentleyCloudRpcProtocol, WebAppRpcRequest } from "@bentley/imodeljs-common";

/**
 * Required to override the `setHeaders` method which allows you to add an additional header to every RpcRequest going to the
 * proxy server.
 * 
 * > Note: Should be supplied to a BentleyCloudRpcProtocol
 */
export class BCAppRpcRequest extends WebAppRpcRequest {
  protected async setHeaders(): Promise<void> {
    super.setHeaders();

    // BC custom header
    this.setHeader("myheader", "value");
  }
}

/**
 * Sub-class the CloudRpcProtocol in order to be able to specify a new RpcRequest class.
 * 
 * > Note: Supply this type as the "protocol" property that us a part of the RpcParams.
 */
export abstract class BCCloudRpcProtocol extends BentleyCloudRpcProtocol {
  public readonly requestType = BCAppRpcRequest;
}
