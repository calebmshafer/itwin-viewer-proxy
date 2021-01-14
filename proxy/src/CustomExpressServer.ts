
import { Guid } from "@bentley/bentleyjs-core";
import * as express from "express";
import { Server as HttpServer } from "http";
import { AuthorizedClientRequestContext, UrlDiscoveryClient } from "@bentley/itwin-client";
import { AuthClient} from "./AuthClient";
import Axios, { AxiosRequestConfig } from "axios";

/** This is a fork of the iModel.js Express Server in order to handle the same requests but forward them to a hosted iModel.js
 * backend in the iTwin Platform.
 */
export class CustomExpressServer {
  private _itwinUrl?: string; // iTwin Platform endpoint for forwarding calls.
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
    this._app.post("*", async (req, res) => this.forwardPostRequest(req, res));
    this._app.get(/\/imodel\//, async (req, res) => this.forwardGetRequest(req, res));
    // for all HTTP requests, identify the server.
    this._app.use("*", (_req, resp) => { resp.send("<h1>IModelJs RPC Server</h1>"); });
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

  // Creates a new Authorized request context with the passed in correlation id
  private async createContext(corrId: string | string[] | undefined) {
    let currCorrelationId = corrId;
    if (undefined === currCorrelationId)
      currCorrelationId = Guid.createValue();
    else if (Array.isArray(currCorrelationId))
      currCorrelationId = currCorrelationId[0];

    const accessToken = await this._client.getAccessToken();
    const ctx = new AuthorizedClientRequestContext(accessToken, currCorrelationId);
    ctx.enter();
    return ctx;
  }

  private async getNewUrl(ctx: AuthorizedClientRequestContext): Promise<string> {
    if (undefined !== this._itwinUrl)
      return this._itwinUrl;
    const urlClient = new UrlDiscoveryClient();
    this._itwinUrl = await urlClient.discoverUrl(ctx, "iModelJsOrchestrator.K8S", undefined);
    ctx.enter();
    return this._itwinUrl;
  }

  private async forwardPostRequest(req: express.Request , res: express.Response) {
    try {
      console.log("post request");
      console.log(req);

      // Get the x-correlation-id to pass along if it exists
      const ctx = await this.createContext(req.headers["x-correlation-id"]);
      ctx.enter();

      const itwinUrl = await this.getNewUrl(ctx);
      ctx.enter();
      console.log(itwinUrl)

      // The frontend client should be configured to use the general-purpose-imodeljs-backend. We can swap everything prior to that in the url
      // with the new iTwin Platform url gathered above.

      // swap the incoming token with the client credentials token
      req.headers.authorization = (await this._client.getAccessToken()).toTokenString();

      const newUrl = new URL(req.url, itwinUrl);
      // const newUrl = new URL(`${itwinUrl}${req.url}`);
      console.log(`${newUrl.toString()}`);
      // send request to iTwin Platform
      const forwardRes = await Axios.post(newUrl.toString(), req.body, {
        headers: {
          Authorization: (await this._client.getAccessToken()).toTokenString(),
          "x-application-version": req.headers["x-application-version"] as string,
          "x-application-id":req.headers["x-application-id"] as string,
          "x-correlation-id": req.headers["x-correlation-id"],
          "x-session-id": req.headers["x-session-id"] as string,
        },
        params: JSON.stringify(req.params),
      });

      // console.log(forwardRes);
      res.send(forwardRes);
    } catch (err) {
      // console.log(err);
      console.log("here");
      res.sendStatus(500);
    }

    // forward response back to the client
  }

  // parse the incoming request and swap it with the appropriate iTwin Platform url
  private async forwardGetRequest(req: express.Request , res: express.Response) {
    // Get the x-correlation-id to pass along if it exists
    const ctx = await this.createContext(req.headers["x-correlation-id"]);
    ctx.enter();

    const itwinUrl = await this.getNewUrl(ctx);
    ctx.enter();

    // The frontend client should be configured to use the general-purpose-imodeljs-backend.  We can swap everything prior to that in the url
    // with the new iTwin Platform url gathered above.
    const newUrl = `${itwinUrl}${req.baseUrl}`;
    console.log(newUrl);

    // swap the incoming token with the client credentials token
    req.headers.authorization = (await this._client.getAccessToken()).toTokenString();

    // send request to iTwin Platform
    const forwardRes = await Axios.get(itwinUrl, {
      url: req.baseUrl,
      headers: {
        authorization: (await this._client.getAccessToken()).toTokenString(),
      },
      params: req.params,
      data: req.body,
    });

    // console.log(forwardRes);

    // forward response back to the client
  }
}
