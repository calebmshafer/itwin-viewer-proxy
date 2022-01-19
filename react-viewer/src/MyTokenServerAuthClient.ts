import {
  AccessToken,
  AuthStatus,
  BeEvent,
  BentleyError,
} from "@itwin/core-bentley";
import { ViewerAuthorizationClient } from "@itwin/web-viewer-react";

export class MyTokenServerAuthClient implements ViewerAuthorizationClient {
  public readonly onAccessTokenChanged = new BeEvent<
    (token: AccessToken) => void
  >();
  protected _accessToken?: AccessToken;

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
      throw new BentleyError(AuthStatus.Error, "Cannot get access token");
    }
    return this._accessToken;
  }
}
