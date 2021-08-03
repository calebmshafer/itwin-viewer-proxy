import { Guid } from "@bentley/bentleyjs-core";
import * as express from "express";
import { Server as HttpServer } from "http";
import {
  AuthorizedClientRequestContext,
  UrlDiscoveryClient,
} from "@bentley/itwin-client";
import { AuthClient } from "./AuthClient";
import Axios from "axios";

/** This is a fork of the iModel.js Express Server in order to handle the same requests but forward them to a hosted iModel.js
 * backend in the iTwin Platform.
 */
export class CustomExpressServer {
  private _itwinUrl?: string; // iTwin Platform endpoint for forwarding calls.
  protected _app: import("express").Application = express();

  constructor(private _client: AuthClient) {}

  protected _configureMiddleware() {
    this._app.use(express.text({ limit: "5mb" }));
    this._app.use(express.raw({ limit: "5mb" }));
  }

  protected _configureHeaders() {
    // enable CORS for all apis
    this._app.all("/**", (_req, res, next) => {
      // console.log("request", _req.method, _req.url, _req.body);

      // The configuration matches 'BentleyCloudRpcConfiguration'
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Correlation-Id, X-Session-Id, X-Application-Id, X-Application-Version, X-User-Id, X-Protocol-Version"
      );
      next();
    });
  }

  protected _configureRoutes() {
    this._app.post("*", async (req, res) => this.forwardPostRequest(req, res));
    this._app.get(/\/imodel\//, async (req, res) =>
      this.forwardGetRequest(req, res)
    );
    // for all HTTP requests, identify the server.
    this._app.use("*", (_req, resp) => {
      resp.send("<h1>IModelJs RPC Server</h1>");
    });
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
      const server: HttpServer = this._app.listen(this._app.get("port"), () =>
        resolve(server)
      );
    });
  }

  // Creates a new Authorized request context with the passed in correlation id
  private async createContext(corrId: string | string[] | undefined) {
    let currCorrelationId = corrId;
    if (!currCorrelationId) {
      currCorrelationId = Guid.createValue();
    } else if (Array.isArray(currCorrelationId)) {
      currCorrelationId = currCorrelationId[0];
    }
    const accessToken = await this._client.getAccessToken();
    const ctx = new AuthorizedClientRequestContext(
      accessToken,
      currCorrelationId
    );
    ctx.enter();
    return ctx;
  }

  private async getNewUrl(
    ctx: AuthorizedClientRequestContext
  ): Promise<string> {
    if (this._itwinUrl) {
      return this._itwinUrl;
    }
    const urlClient = new UrlDiscoveryClient();
    this._itwinUrl = await urlClient.discoverUrl(
      ctx,
      "iModelJsOrchestrator.K8S",
      undefined
    );
    ctx.enter();
    return this._itwinUrl;
  }

  private async forwardPostRequest(
    req: express.Request,
    res: express.Response
  ) {
    try {
      // Get the x-correlation-id to pass along if it exists
      const ctx = await this.createContext(req.headers["x-correlation-id"]);
      ctx.enter();

      const itwinUrl = await this.getNewUrl(ctx);
      ctx.enter();

      // The frontend client should be configured to use the general-purpose-imodeljs-backend. Then everything before that will be swapped out
      // prior it is sent to the new iTwin Platform url gathered above.
      //
      // e.g. '/general-purpose-imodeljs-backend/v2.0/mode/1/context/{GUID}/imodel/{GUID}/changeset/{id}/{operation}'

      const { host, referrer, authorization, ...incomingHeaders } = req.headers;
      const forwardRes = await Axios.post(`${itwinUrl}${req.url}`, req.body, {
        headers: {
          ...incomingHeaders,
          authorization: ctx.accessToken.toTokenString(),
        },
        params: req.params,
      });

      if (typeof forwardRes.data === "string") {
        res.setHeader("content-type", "text/plain");
        res.send(JSON.stringify(forwardRes.data));
      } else {
        res.send(forwardRes.data);
      }
      res.end();
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  // parse the incoming request and swap it with the appropriate iTwin Platform url
  private async forwardGetRequest(req: express.Request, res: express.Response) {
    try {
      // Get the x-correlation-id to pass along if it exists
      const ctx = await this.createContext(req.headers["x-correlation-id"]);
      ctx.enter();

      const itwinUrl = await this.getNewUrl(ctx);
      ctx.enter();

      // The frontend client should be configured to use the general-purpose-imodeljs-backend. We can swap everything prior to that in the url
      // with the new iTwin Platform url gathered above.

      const { host, referrer, authorization, ...incomingHeaders } = req.headers;

      // send request to iTwin Platform
      const forwardRes = await Axios.get(`${itwinUrl}${req.baseUrl}`, {
        url: req.baseUrl,
        headers: {
          // Forward a few headers from the incoming request with the request to the iTwin Platform
          ...incomingHeaders,
          authorization: ctx.accessToken.toTokenString(),
        },
        params: req.params,
      });

      res.send(forwardRes.data);
      res.end();
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
}
