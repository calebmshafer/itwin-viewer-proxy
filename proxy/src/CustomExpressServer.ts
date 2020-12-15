
import { Guid } from "@bentley/bentleyjs-core";
import * as express from "express";
import { Server as HttpServer } from "http";
import { AuthorizedClientRequestContext, UrlDiscoveryClient } from "@bentley/itwin-client";
import { AuthClient} from "./AuthClient";

/** This is a fork of the iModel.js Express Server in order to handle the same requests but forward them to a hosted iModel.js
 * backend in the iTwin Platform.
 */
export class CustomExpressServer {
  private _client: AuthClient;
  protected _app: import("express").Application = express();

  constructor(client: AuthClient) {
    this._client = client;
   }

  protected _configureMiddleware() {
    this._app.use(express.text({ limit: "5mb" })); 
    this._app.use(express.raw({ limit: "5mb" }));
  }

  protected _configureHeaders() {
    // enable CORS for all apis
    this._app.all("/**", (_req, res, next) => {
      // The configuration matches 'BentleyCloudRpcConfiguration'
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Correlation-Id, X-Session-Id, X-Application-Id, X-Application-Version, X-User-Id, X-Protocol-Version");
      next();
    });
  }

  protected _configureRoutes() {
    // for all HTTP requests, identify the server.
    this._app.use("*", async (req, resp) => this.forwardRequest(req, resp));
  }

  /**
   * Configure the express application with necessary headers, routes, and middleware, then starts listening on the given port.
   * @param port The port to listen on
   */
  public async initialize(port: number | string): Promise<HttpServer> {
    this._configureMiddleware();
    this._configureHeaders();
    this._configureRoutes();

    this._app.set("port", port);
    return new Promise<HttpServer>((resolve) => {
      const server: HttpServer = this._app.listen(this._app.get("port"), () => resolve(server));
    });
  }

  private async createContext(corrId: string = Guid.createValue()) {
    const accessToken = await this._client.getAccessToken();
    const ctx = new AuthorizedClientRequestContext(accessToken, corrId);
    ctx.enter();
    return ctx;
  }

  // parse the incoming request and swap it with the appropriate iTwin Platform url
  private async forwardRequest(req: express.Request , res: express.Response) {
    console.log(req);

    const urlClient = new UrlDiscoveryClient();

    // Get the x-correlation-id to pass along if it exists
    let correlationId = req.headers["x-correlation-id"];
    let ctx;
    if (undefined === correlationId)
      ctx = await this.createContext();
    else if (Array.isArray(correlationId))
      ctx = await this.createContext(correlationId[0]);
    else
      ctx = await this.createContext(correlationId);

    const itwinUrl = await urlClient.discoverUrl(ctx, "iModelJsOrchestrator.K8S", undefined);
    ctx.enter();

    // The frontend client should be configured to use the general-purpose-imodeljs-backend.  We can swap everything prior to that in the url
    // with the new iTwin Platform url gathered above.
    const idx = req.url.indexOf("general-purpose-imodeljs-backend");
    const newUrl = `${itwinUrl}${req.url.substr(idx, req.url.length - 1)}`;
    console.log(newUrl);

    // swap the incoming token with the client credentials token

    // send request to iTwin Platform

    // forward response back to the client
  }
}
