import {
  AccessToken,
  AuthStatus,
  BeEvent,
  BentleyError,
} from "@itwin/core-bentley";
import { ViewerAuthorizationClient } from "@itwin/web-viewer-react";

export class MyTokenServerAuthClient implements ViewerAuthorizationClient {
  readonly onAccessTokenChanged = new BeEvent<(token: AccessToken) => void>();

  getAccessToken(): Promise<AccessToken> {
    throw new Error("Method not implemented.");
  }
}
