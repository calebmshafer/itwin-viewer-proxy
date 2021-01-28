import { AuthStatus, BeEvent, BentleyError, ClientRequestContext } from "@bentley/bentleyjs-core";
import { AccessToken } from "@bentley/itwin-client";
import { FrontendAuthorizationClient, BrowserAuthorizationClient } from "@bentley/frontend-authorization-client";
import { UserManager, WebStorageStateStore } from 'oidc-client';
import { ProxyClient } from './ProxyClient';

export class NoSignInIAuthClient {
  private static _oidcClient: FrontendAuthorizationClient;
  private static _userManager: UserManager

  public static get oidcClient(): FrontendAuthorizationClient {
    if(!this._oidcClient) {
      this._oidcClient = new ProxyClient()
    }

    return this._oidcClient;
  }

  public static get userManager(): UserManager {
    if(!this._userManager) {
      this._userManager = new UserManager({
        client_id: "xxxxxxx",
        // userStore: new WebStorageStateStore({ store: localStorage }),
        silent_redirect_uri: 'http://localhost:3001/silent-signin',
        metadataUrl: 'http://localhost:3001/metadata-url',
        // redirect_uri: 'http://localhost:3000/signin-callback',
        // post_logout_redirect_uri: 'http://localhost:3000/logout',
        authority: 'http://localhost:3001/',
      })
    }

    return this._userManager
  }

}