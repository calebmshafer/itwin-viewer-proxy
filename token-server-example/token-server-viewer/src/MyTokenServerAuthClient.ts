import {
  AccessToken,
  BentleyStatus,
  BentleyError,
} from "@itwin/core-bentley";
import { BrowserAuthorizationClient, BrowserAuthorizationClientConfiguration } from "@itwin/browser-authorization";

export class MyTokenServerAuthClient extends BrowserAuthorizationClient {
  constructor(opts?: BrowserAuthorizationClientConfiguration){
    // We don't need this configuration as our token comes from the token server
    super(opts ?? {clientId: "", scope: "", redirectUri: ""});
  };

  public async initialize() {
    // defaults to the localhost version of the token server
    const tokenUrl = process.env.TOKEN_URL ?? "http://localhost:3001/getToken";
    try {
      const res = await fetch(tokenUrl);
      if (res) {
        const accessToken = await res.text();
        this._accessToken = accessToken;
        this.onAccessTokenChanged.raiseEvent(accessToken);
      }
    } catch (err) {
      console.log(err);
    }
  }

  public async getAccessToken(): Promise<AccessToken> {
    if (!this._accessToken) {
      throw new BentleyError(BentleyStatus.ERROR, "Cannot get access token");
    }
    return this._accessToken;
  }
}
