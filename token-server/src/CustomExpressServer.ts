import * as express from "express";
import { Server as HttpServer } from "http";
import type { AccessToken } from "@itwin/core-bentley";
import type { AuthorizationClient } from "@itwin/core-common";

export class CustomExpressServer {
  protected _app: import("express").Application = express();

  constructor(private _client: AuthorizationClient) {}

  protected _configureHeaders() {
    // enable CORS for all apis
    this._app.all("/**", (_req, res, next) => {
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
    this._app.get("/getToken", async (req, res) => this._getToken(req, res));
  }

  /**
   * Configure the express application with necessary headers, routes, and middleware, then starts listening on the given port.
   * @param port The port to listen on
   */
  public async initialize(port: number | string): Promise<HttpServer> {
    this._configureHeaders();
    this._configureRoutes();

    this._app.set("port", port);
    return new Promise<HttpServer>((resolve) => {
      const server: HttpServer = this._app.listen(this._app.get("port"), () =>
        resolve(server)
      );
    });
  }

  private async _getToken(_req: express.Request, res: express.Response) {
    try {
      const token: AccessToken = await this._client.getAccessToken();
      res.send(token);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
}
