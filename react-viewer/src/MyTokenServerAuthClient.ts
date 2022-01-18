import {
  AccessToken,
  AuthStatus,
  BeEvent,
  BentleyError,
} from "@itwin/core-bentley";
import { ViewerAuthorizationClient } from "@itwin/web-viewer-react";

export class MyTokenServerAuthClient implements ViewerAuthorizationClient {
  protected _accessToken?: AccessToken;
  protected _tokenUrl: string;

  public constructor(tokenUrl: string) {
    this.onAccessTokenChanged = new BeEvent();
    this._tokenUrl = tokenUrl;
  }

  public async initialize() {
    if (!this._tokenUrl) {
      throw new BentleyError(
        AuthStatus.Error,
        "Cannot initialize token server auth client without token url"
      );
    }
    try {
      const res = await fetch(this._tokenUrl);
      if (res) {
        const accessToken = await res.text();
        console.log(accessToken);
        this._accessToken = accessToken;
        this.onAccessTokenChanged.raiseEvent(accessToken);
      }
    } catch (err) {
      console.log(err);
    }
  }

  public readonly onAccessTokenChanged = new BeEvent<
    (token: AccessToken) => void
  >();

  public async getAccessToken(): Promise<AccessToken> {
    if (!this._accessToken) {
      throw new BentleyError(AuthStatus.Error, "Cannot get access token");
    }
    return this._accessToken;
  }
}
