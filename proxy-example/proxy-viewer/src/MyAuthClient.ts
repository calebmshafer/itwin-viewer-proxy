import {
  AccessToken,
  BeEvent,
} from "@itwin/core-bentley";
import { ViewerAuthorizationClient } from "@itwin/web-viewer-react";

export class MyAuthClient implements ViewerAuthorizationClient {
  public readonly onAccessTokenChanged = new BeEvent<
    (token: AccessToken) => void
  >();
  protected _accessToken?: AccessToken;

  public async initialize() {
    this._accessToken = "Bearer dummy";
  }

  public async getAccessToken(): Promise<AccessToken> {
    return "Bearer dummy";
  }
}
